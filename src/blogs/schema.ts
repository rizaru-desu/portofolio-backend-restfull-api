import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer } from 'drizzle-orm/pg-core';
import { pgTable, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';

export const blogPosts = pgTable(
  'blogposts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    contentMdx: text('content_mdx').notNull(), // 👉 konten utama MDX
    coverImage: text('cover_image'),
    status: varchar('status', { length: 20 })
      .$type<'draft' | 'published' | 'unpublished'>()
      .default('draft')
      .notNull(),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('blog_slug_idx').on(table.slug),
    index('blog_status_idx').on(table.status),
    index('blog_published_idx').on(table.publishedAt),
  ],
);

export const blogReads = pgTable(
  'blogreads',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    postId: varchar('post_id', { length: 36 }).notNull(),
    fingerprintId: varchar('fingerprint_id', { length: 64 }),
    sessionKey: varchar('session_key', { length: 64 }).notNull(),
    durationSeconds: integer('duration_seconds').default(0).notNull(),
    maxScrollPercent: integer('max_scroll_percent').default(0),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    endedAt: timestamp('ended_at'),
  },
  (table) => [
    index('blog_read_post_idx').on(table.postId),
    index('blog_read_fingerprint_idx').on(table.fingerprintId),
    index('blog_read_session_idx').on(table.sessionKey),
  ],
);

export const blogPostsRelations = relations(blogPosts, ({ many }) => ({
  reads: many(blogReads),
}));

export const blogReadsRelations = relations(blogReads, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogReads.postId],
    references: [blogPosts.id],
  }),
}));
