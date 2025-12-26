import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as visitorSchema from '../schema';
import { lookup, Lookup } from 'geoip-lite';
import { HeartbeatDto } from './visitors.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { and, eq, lt, desc, isNotNull, sql } from 'drizzle-orm';

type DrizzleDB = NodePgDatabase<typeof visitorSchema>;

@Injectable()
export class VisitorsService {
  constructor(@Inject(DATABASE_CONNECTION) private db: DrizzleDB) {}

  async handleHeartbeat(dto: HeartbeatDto, ip: string) {
    const cleanIp = ip.replace('::ffff:', '');

    // 1. get lookup
    const geo: Lookup | null = lookup(cleanIp);

    // 2. update atau insert
    const updateData = {
      lastActiveAt: new Date(),
      isOnline: true,
      currentPath: dto.path || '/',
      ipAddress: cleanIp,
      // Gunakan optional chaining (?.) dan null coalescing (|| null)
      country: geo?.country || null,
      city: geo?.city || null,
      // Array access juga harus aman
      latitude: geo?.ll?.[0] ? String(geo.ll[0]) : null,
      longitude: geo?.ll?.[1] ? String(geo.ll[1]) : null,
    };

    await this.db
      .insert(visitorSchema.visitors)
      .values({
        fingerprintId: dto.fingerprintId,
        userAgent: dto.userAgent,
        ...updateData,
      })
      .onConflictDoUpdate({
        target: visitorSchema.visitors.fingerprintId,
        set: updateData,
      });

    return { success: true };
  }

  async handleOffline(fingerprintId: string) {
    if (!fingerprintId) return;

    await this.db
      .update(visitorSchema.visitors)
      .set({
        isOnline: false,
        // Opsional: update last active agar tau kapan tepatnya dia log out
        lastActiveAt: new Date(),
      })
      .where(eq(visitorSchema.visitors.fingerprintId, fingerprintId));

    return { success: true };
  }

  async handleMaps() {
    const visitors = await this.db
      .select({
        fingerprintId: visitorSchema.visitors.fingerprintId,

        // ⬇️ cast ke number LANGSUNG di SQL
        lat: sql<number>`${visitorSchema.visitors.latitude}::float`,
        lng: sql<number>`${visitorSchema.visitors.longitude}::float`,

        lastActiveAt: visitorSchema.visitors.lastActiveAt,
        country: visitorSchema.visitors.country,
        city: visitorSchema.visitors.city,
        currentPath: visitorSchema.visitors.currentPath,

        status: sql<'online' | 'offline'>`
        CASE
          WHEN ${visitorSchema.visitors.lastActiveAt}
            >= NOW() - INTERVAL '2 minutes'
          THEN 'online'
          ELSE 'offline'
        END
      `.as('status'),
      })
      .from(visitorSchema.visitors)
      .where(
        and(
          isNotNull(visitorSchema.visitors.latitude),
          isNotNull(visitorSchema.visitors.longitude),
        ),
      )
      .orderBy(desc(visitorSchema.visitors.lastActiveAt))
      .limit(2000);

    return visitors;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleOfflineVisitors() {
    // Batas waktu toleransi (misal: 1 menit yang lalu)
    // Jika heartbeat client dikirim tiap 30 detik, 1 menit adalah batas aman (2x miss heartbeat)
    const thresholdTime = new Date(Date.now() - 60 * 1000);

    await this.db
      .update(visitorSchema.visitors)
      .set({ isOnline: false })
      .where(
        and(
          lt(visitorSchema.visitors.lastActiveAt, thresholdTime),
          eq(visitorSchema.visitors.isOnline, true),
        ),
      );
  }
}
