import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, eq, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as testimonialSchema from './schema';
import {
  DeleteTestimoniDto,
  ListTestimoniDto,
  PublishTestimoniDto,
} from './testimoni.dto';

type DrizzleDB = NodePgDatabase<typeof testimonialSchema>;

@Injectable()
export class TestimoniService {
  constructor(@Inject(DATABASE_CONNECTION) private db: DrizzleDB) {}

  async deleteTestimonial(dto: DeleteTestimoniDto) {
    await this.db
      .delete(testimonialSchema.testimonial)
      .where(eq(testimonialSchema.testimonial.id, dto.id));

    return {
      code: 'TESTIMONIAL_SUCCESS',
      message: 'Delete testimonial success',
    };
  }

  async listTestimonial(dto: ListTestimoniDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const offset = (page - 1) * limit;

    const data = await this.db
      .select()
      .from(testimonialSchema.testimonial)
      .where(eq(testimonialSchema.testimonial.isPublished, true))
      .orderBy(desc(testimonialSchema.testimonial.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await this.db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(testimonialSchema.testimonial)
      .where(eq(testimonialSchema.testimonial.isPublished, true));

    const total = Number(totalResult[0].count);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async publishTestimonial(dto: PublishTestimoniDto) {
    await this.db
      .update(testimonialSchema.testimonial)
      .set({
        isPublished: dto.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(testimonialSchema.testimonial.id, dto.id))
      .returning();

    return {
      code: 'TESTIMONIAL_SUCCESS',
      message: ` ${dto.isPublished ? 'Publish' : 'Not Publish'} testimonial success`,
    };
  }
}
