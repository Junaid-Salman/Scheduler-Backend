import { Module } from '@nestjs/common';
import { SCHEDULER_REPOSITORY, USERS_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from './repositories.constants';
import { PrismaSchedulerRepository } from './prisma/repositories/prisma-scheduler.repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users.repository';
import { PrismaRefreshTokenRepository } from './prisma/repositories/prisma-refresh-token.repository';

@Module({
  providers: [
    {
      provide: SCHEDULER_REPOSITORY,
      useClass: PrismaSchedulerRepository,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaUsersRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [SCHEDULER_REPOSITORY, USERS_REPOSITORY, REFRESH_TOKEN_REPOSITORY],
})
export class RepositoriesModule {}

export { SCHEDULER_REPOSITORY, USERS_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from './repositories.constants';
