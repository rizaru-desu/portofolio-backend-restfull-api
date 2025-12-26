import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const testimonial = pgTable(
  'testimoni',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar('name', { length: 100 }).notNull(),
    role: varchar('role', { length: 100 }),
    company: varchar('company', { length: 150 }),
    message: text('message').notNull(),
    avatarUrl: varchar('avatar_url', { length: 255 }),
    isPublished: boolean('is_published').default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('testimoni_idx').on(table.id)],
);
