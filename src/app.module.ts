import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from './application/application.module';
import { RepositoriesModule } from './infrastructure/repositories.module';
import { ormEntities } from './infrastructure/orm/entities';
import { SchedulerController } from './adapters/controllers/scheduler/scheduler.controller';
import { UsersController } from './adapters/controllers/users/users.controller';
import { AuthModule } from './adapters/controllers/auth/auth.module';
import { JwtAuthGuard } from './adapters/controllers/auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URI,
      entities: ormEntities,
      synchronize: true, // ⚠️ use false in production
    }),
    ApplicationModule,
    RepositoriesModule,
    AuthModule,
  ],
  controllers: [AppController, SchedulerController, UsersController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
