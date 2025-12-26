import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'; // Import helper Drizzle
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as portofolioSchema from './schema';
import {
  PortfolioQueryDto,
  RemovePortfolioDto,
  SavePortfolioDto,
  UpdatePortfolioStatusDto,
} from './portofolio.dto';

type DrizzleDB = NodePgDatabase<typeof portofolioSchema>;

@Injectable()
export class PortofolioService {
  constructor(@Inject(DATABASE_CONNECTION) private db: DrizzleDB) {}

  async save(dto: SavePortfolioDto) {
    return await this.db.transaction(async (tx) => {
      await tx
        .insert(portofolioSchema.portfolios)
        .values({
          id: dto.id,
          slug: dto.slug,
          title: dto.title,
          subtitle: dto.subtitle,
          description: dto.description,
          difficulty: dto.difficulty,
          coverImage: dto.coverImage,
          viewCodeUrl: dto.viewCodeUrl,
          liveDemoUrl: dto.liveDemoUrl,
          status: dto.status ?? 'draft',
        })
        .onConflictDoUpdate({
          target: portofolioSchema.portfolios.id,
          set: {
            slug: dto.slug,
            title: dto.title,
            subtitle: dto.subtitle,
            description: dto.description,
            difficulty: dto.difficulty,
            coverImage: dto.coverImage,
            viewCodeUrl: dto.viewCodeUrl,
            liveDemoUrl: dto.liveDemoUrl,
            status: dto.status,
          },
        });

      if (dto.technologyIds && Array.isArray(dto.technologyIds)) {
        await tx
          .delete(portofolioSchema.portfolioTechnologies)
          .where(
            eq(portofolioSchema.portfolioTechnologies.portfolioId, dto.id!),
          );

        if (dto.technologyIds.length > 0) {
          const uniqueTechIds = [...new Set(dto.technologyIds)];

          const techValues = uniqueTechIds.map((techId) => ({
            portfolioId: dto.id!,
            technologyId: techId,
          }));

          await tx
            .insert(portofolioSchema.portfolioTechnologies)
            .values(techValues);
        }
      }

      return {
        CODE: 'PORTOFOLIO_SUCCESS',
        MESSAGE: `Portfolio saved ${dto.title} successfully`,
      };
    });
  }

  async findAll(query: PortfolioQueryDto) {
    const { page = 1, limit = 10, search, status, difficulty } = query;
    const offset = (page - 1) * limit;

    const whereCondition = and(
      status ? eq(portofolioSchema.portfolios.status, status) : undefined,

      difficulty
        ? eq(portofolioSchema.portfolios.difficulty, difficulty)
        : undefined,

      search
        ? or(
            ilike(portofolioSchema.portfolios.title, `%${search}%`),
            ilike(portofolioSchema.portfolios.slug, `%${search}%`),
          )
        : undefined,
    );

    const data = await this.db.query.portfolios.findMany({
      where: whereCondition,
      limit: limit,
      offset: offset,
      orderBy: [desc(portofolioSchema.portfolios.createdAt)],
      with: {
        technologies: {
          with: {
            technology: true,
          },
        },
      },
    });

    const [totalCountResult] = await this.db
      .select({
        count: sql<number>`cast(count(${portofolioSchema.portfolios.id}) as int)`,
      })
      .from(portofolioSchema.portfolios)
      .where(whereCondition);

    const total = totalCountResult.count;

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async PublicAll() {
    const data = await this.db.query.portfolios.findMany({
      orderBy: [desc(portofolioSchema.portfolios.createdAt)],
      with: {
        technologies: {
          with: {
            technology: true,
          },
        },
      },
    });

    return {
      data,
    };
  }

  async updateStatus(dto: UpdatePortfolioStatusDto) {
    const [updated] = await this.db
      .update(portofolioSchema.portfolios)
      .set({ status: dto.status, updatedAt: new Date() })
      .where(eq(portofolioSchema.portfolios.id, dto.id))
      .returning(); // Mengembalikan data yang baru diupdate

    if (!updated) {
      throw new NotFoundException(`Portfolio with ID ${dto.id} not found`);
    }

    return {
      CODE: 'PORTOFOLIO_SUCCESS',
      message: `Portfolio dengan ID ${dto.id} berhasil di update`,
    };
  }

  async remove(dto: RemovePortfolioDto) {
    const [deleted] = await this.db
      .delete(portofolioSchema.portfolios)
      .where(eq(portofolioSchema.portfolios.id, dto.id))
      .returning({ id: portofolioSchema.portfolios.id });

    if (!deleted) {
      throw new NotFoundException(`Portfolio with ID ${dto.id} not found`);
    }

    return {
      CODE: 'PORTFOLIO_DELETED',
      MESSAGE: `Portfolio ID ${dto.id} has been deleted`,
    };
  }
}
