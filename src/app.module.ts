import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database/database-connection';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import {
  BETTER_AUTH_CLIENT,
  BetterAuthInstance,
} from './authentication/better-auth-client';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter';
import { authentication } from './authentication/auth';
import { HeartbeatController } from './heartbeat/heartbeat.controller';
import { VisitorsService } from './heartbeat/visitors/visitors.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { CarrierController } from './carrier/carrier.controller';
import { PortofolioController } from './portofolio/portofolio.controller';
import { PortofolioService } from './portofolio/portofolio.service';
import { CarrierService } from './carrier/carrier.service';
import { TestimoniService } from './testimoni/testimoni.service';
import { TestimoniController } from './testimoni/testimoni.controller';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule.forRootAsync({
      useFactory: (auth: BetterAuthInstance) => ({
        auth,
      }),
      inject: [BETTER_AUTH_CLIENT],
    }),
    UsersModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [HeartbeatController, BlogsController, CarrierController, PortofolioController, TestimoniController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: BETTER_AUTH_CLIENT,
      useFactory: (database: NodePgDatabase) => {
        return authentication(database);
      },
      inject: [DATABASE_CONNECTION],
    },
    VisitorsService,
    BlogsService,
    PortofolioService,
    CarrierService,
    TestimoniService,
  ],
  exports: [BETTER_AUTH_CLIENT],
})
export class AppModule {}
