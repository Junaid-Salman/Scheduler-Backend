import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SCHEDULER_REPOSITORY, USERS_REPOSITORY } from './repositories.constants';
import { TypeOrmSchedulerRepository } from './orm/repositories/typeorm-scheduler.repository';
import { TypeOrmUsersRepository } from './orm/repositories/typeorm-users.repository';
import { ShiftOrmEntity, UserOrmEntity } from './orm/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShiftOrmEntity, UserOrmEntity]),
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
  ],
  exports: [SCHEDULER_REPOSITORY, USERS_REPOSITORY],
})
export class RepositoriesModule {}

export { SCHEDULER_REPOSITORY, USERS_REPOSITORY } from './repositories.constants';
