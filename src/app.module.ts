import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from './application/application.module';
import { RepositoriesModule } from './infrastructure/repositories.module';
import { ormEntities } from './infrastructure/orm/entities';
import { SchedulerController } from './adapters/controllers/scheduler/scheduler.controller';
import { UsersController } from './adapters/controllers/users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      database: 'Scheduler',
      entities: ormEntities,
      synchronize: true, // ⚠️ use false in production
    }),
    ApplicationModule,
    RepositoriesModule,
  ],
  controllers: [AppController, SchedulerController, UsersController],
  providers: [AppService],
})
export class AppModule {}
