import { createId } from '@paralleldrive/cuid2';
import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const workExperience = pgTable('work_experience', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  periodStart: varchar('period_start', { length: 10 }).notNull(), // "2021"
  periodEnd: varchar('period_end', { length: 10 }).notNull(), // "PRESENT"
  companyName: varchar('company_name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
});
