import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as blogsSchema from './schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import {
  ChangeStatusDto,
  detailDto,
  ListBlogDto,
  SaveBlogDto,
} from './blogs.dto';
import { and, desc, eq, ilike, sql, gte, lte } from 'drizzle-orm';
import _ from 'lodash';
import path from 'path';

type DrizzleDB = NodePgDatabase<typeof blogsSchema>;

@Injectable()
export class BlogsService {
  constructor(@Inject(DATABASE_CONNECTION) private db: DrizzleDB) {}

  private normalizeDateRange(dateRange?: { from?: string; to?: string }) {
    if (!dateRange) return {};

    const fromDate = dateRange.from ? new Date(dateRange.from) : undefined;

    const toDate = dateRange.to
      ? new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))
      : undefined;

    return { fromDate, toDate };
  }

  async listingBlog(params: ListBlogDto) {
    const { page = 1, limit = 10, search, status, dateRange } = params;

    const offset = (page - 1) * limit;
    const { fromDate, toDate } = this.normalizeDateRange(dateRange);

    const whereClause = and(
      status ? eq(blogsSchema.blogPosts.status, status) : undefined,
      search ? ilike(blogsSchema.blogPosts.title, `%${search}%`) : undefined,
      fromDate ? gte(blogsSchema.blogPosts.createdAt, fromDate) : undefined,
      toDate ? lte(blogsSchema.blogPosts.createdAt, toDate) : undefined,
    );

    const data = await this.db.query.blogPosts.findMany({
      where: whereClause,
      orderBy: desc(blogsSchema.blogPosts.updatedAt),
      limit,
      offset,
    });

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(blogsSchema.blogPosts)
      .where(whereClause);

    return {
      data: _.chain(data)
        .omit(['contentMdx'])
        .map((post) => ({
          ...post,
          coverImage: post.coverImage
            ? `/blogs/cover/${path.basename(post.coverImage)}`
            : null,
        }))
        .value(),
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPage: Math.ceil(Number(count) / limit),
      },
    };
  }

  async saveBlog(body: SaveBlogDto, coverImagePath?: string) {
    await this.db
      .insert(blogsSchema.blogPosts)
      .values({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        contentMdx: body.contentMdx,
        status: body.status ?? 'draft',
        coverImage: coverImagePath ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: blogsSchema.blogPosts.id,
        set: {
          title: body.title,
          slug: body.slug,
          excerpt: body.excerpt,
          contentMdx: body.contentMdx,
          status: body.status ?? 'draft',
          coverImage: coverImagePath ?? null,
          updatedAt: new Date(),
        },
      });

    return { code: 'BLOG_SUCCESS', message: 'Success create blog...' };
  }

  async changeStatus(body: ChangeStatusDto) {
    const updated = await this.db
      .update(blogsSchema.blogPosts)
      .set({ status: body.status, updatedAt: new Date() })
      .where(eq(blogsSchema.blogPosts.id, body.id));
    if (!updated) throw new NotFoundException('Blog not found');
    return {
      code: 'BLOG_SUCCESS',
      message: `Success update status ${body.status}`,
    };
  }

  async detailBlog(body: detailDto) {
    const blog = await this.db.query.blogPosts.findFirst({
      where: and(
        eq(blogsSchema.blogPosts.id, body.id),
        eq(blogsSchema.blogPosts.status, 'published'),
      ),
    });

    if (!blog) throw new NotFoundException('Blog not found');

    return {
      code: 'DETAIL_BLOG_SUCCESS',
      message: `Success update status ${blog?.title}`,
      data: {
        ...blog,
        coverImage: blog.coverImage
          ? `/blogs/cover/${path.basename(blog.coverImage)}`
          : null,
      },
    };
  }
}
