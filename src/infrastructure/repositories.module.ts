import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SCHEDULER_REPOSITORY, USERS_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from './repositories.constants';
import { TypeOrmSchedulerRepository } from './orm/repositories/typeorm-scheduler.repository';
import { TypeOrmUsersRepository } from './orm/repositories/typeorm-users.repository';
import { TypeOrmRefreshTokenRepository } from './orm/repositories/typeorm-refresh-token.repository';
import { ShiftOrmEntity, UserOrmEntity, RefreshTokenOrmEntity } from './orm/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShiftOrmEntity, UserOrmEntity, RefreshTokenOrmEntity]),
  ],
  providers: [
    {
      provide: SCHEDULER_REPOSITORY,
      useClass: TypeOrmSchedulerRepository,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: TypeOrmUsersRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: TypeOrmRefreshTokenRepository,
    },
  ],
  exports: [SCHEDULER_REPOSITORY, USERS_REPOSITORY, REFRESH_TOKEN_REPOSITORY],
})
export class RepositoriesModule {}

export { SCHEDULER_REPOSITORY, USERS_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from './repositories.constants';
