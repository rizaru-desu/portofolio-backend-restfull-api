import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  varchar,
  timestamp,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// --- 1. Tabel Technologies (Master Data) ---
export const technologies = pgTable('technologies', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'), // opsional
});

// --- 2. Tabel Portfolios (Utama) ---
export const portfolios = pgTable(
  'portfolios',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    description: text('description').notNull(),

    difficulty: varchar('difficulty', { length: 10 })
      .$type<'easy' | 'medium' | 'hard' | 'very hard'>()
      .notNull(),

    coverImage: text('cover_image'),
    viewCodeUrl: text('view_code_url'),
    liveDemoUrl: text('live_demo_url'),

    status: varchar('status', { length: 20 })
      .$type<'draft' | 'published' | 'on progress'>()
      .default('draft'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index('portfolio_slug_idx').on(t.slug),
    index('portfolio_status_idx').on(t.status),
  ],
);

// --- 3. Tabel Penghubung (Junction Table) ---
export const portfolioTechnologies = pgTable(
  'portfolio_technologies',
  {
    portfolioId: text('portfolio_id')
      .notNull()
      .references(() => portfolios.id, { onDelete: 'cascade' }), // Hapus portfolio -> Hapus relasi

    technologyId: text('technology_id')
      .notNull()
      .references(() => technologies.id, { onDelete: 'cascade' }), // Hapus tech -> Hapus relasi
  },
  (t) => [
    // Composite Primary Key: Mencegah duplikat pair (Portfolio A tidak bisa punya Tech B dua kali)
    primaryKey({ columns: [t.portfolioId, t.technologyId] }),
    index('portfolio_tech_portfolio_idx').on(t.portfolioId),
    index('portfolio_tech_tech_idx').on(t.technologyId),
  ],
);

// --- 4. Relations Definitions (Untuk Query 'with') ---

export const portfoliosRelations = relations(portfolios, ({ many }) => ({
  technologies: many(portfolioTechnologies),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  portfolios: many(portfolioTechnologies),
}));

export const portfolioTechnologiesRelations = relations(
  portfolioTechnologies,
  ({ one }) => ({
    portfolio: one(portfolios, {
      fields: [portfolioTechnologies.portfolioId],
      references: [portfolios.id],
    }),
    technology: one(technologies, {
      fields: [portfolioTechnologies.technologyId],
      references: [technologies.id],
    }),
  }),
);
