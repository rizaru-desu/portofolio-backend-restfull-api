import {
  pgTable,
  text,
  boolean,
  timestamp,
  varchar,
  index,
  decimal,
} from 'drizzle-orm/pg-core';

export const visitors = pgTable(
  'visitors',
  {
    fingerprintId: varchar('fingerprint_id', { length: 64 }).primaryKey(), // Gunakan Fingerprint ID sebagai Primary Key atau Unique Key agar tidak ada duplikat
    isOnline: boolean('is_online').default(true).notNull(), // Status
    lastActiveAt: timestamp('last_active_at').defaultNow().notNull(), // Waktu terakhir heartbeat (PENTING untuk Cron Job)
    userAgent: text('user_agent'), // Metadata User (Optional, diupdate jika berubah)
    ipAddress: varchar('ip_address', { length: 45 }), // Support IPv6
    country: varchar('country', { length: 2 }), // ID, US, SG
    city: text('city'),
    latitude: decimal('latitude'), // Bisa pakai numeric/decimal
    longitude: decimal('longitude'),
    currentPath: text('current_path'), // Fitur tambahan: Sedang di halaman mana?
    createdAt: timestamp('created_at').defaultNow(), // Kapan pertama kali datang
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('last_active_idx').on(table.lastActiveAt),
    index('is_online_idx').on(table.isOnline),
  ],
);
