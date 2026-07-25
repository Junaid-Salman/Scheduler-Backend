import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { RepositoriesModule } from './infrastructure/repositories.module';
import { SchedulerController } from './adapters/controllers/scheduler/scheduler.controller';
import { UsersController } from './adapters/controllers/users/users.controller';
import { AuthModule } from './adapters/controllers/auth/auth.module';
import { JwtAuthGuard } from './adapters/controllers/auth/jwt-auth.guard';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
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
