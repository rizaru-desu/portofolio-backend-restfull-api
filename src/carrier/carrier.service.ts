import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as carrierSchema from './schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { SaveCarrierDto, DeleteDto } from './carrier.dto';
import { eq } from 'drizzle-orm';

type DrizzleDB = NodePgDatabase<typeof carrierSchema>;
@Injectable()
export class CarrierService {
  constructor(@Inject(DATABASE_CONNECTION) private db: DrizzleDB) {}

  async listingWorkExperience() {
    const workExprience = await this.db.query.workExperience.findMany({
      orderBy: (workExperience, { desc }) => [desc(workExperience.periodStart)],
    });
    return {
      code: 'WORKEXPERIENCE_SUCCESS',
      message: '',
      data: workExprience,
    };
  }

  async saveWorkExperience(body: SaveCarrierDto) {
    await this.db
      .insert(carrierSchema.workExperience)
      .values({
        title: body.title,
        periodStart: body.periodStart,
        periodEnd: body.periodEnd,
        companyName: body.companyName,
        description: body.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: carrierSchema.workExperience.id,
        set: {
          title: body.title,
          periodStart: body.periodStart,
          periodEnd: body.periodEnd,
          companyName: body.companyName,
          description: body.description,
          updatedAt: new Date(),
        },
      });
    return {
      code: 'WORKEXPERIENCE_SUCCESS',
      message: 'Saving Success',
    };
  }

  async deleteWorkExperience(body: DeleteDto) {
    if (!body.id) {
      throw new BadRequestException('Id is required');
    }
    await this.db
      .delete(carrierSchema.workExperience)
      .where(eq(carrierSchema.workExperience.id, body.id));

    return {
      code: 'WORKEXPERIENCE_SUCCESS',
      message: 'Delete work experience success',
    };
  }
}
