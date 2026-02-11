import { Injectable, Inject, Logger } from '@nestjs/common';
import { GlobalResponseDto } from '../../dtos/common';
import { UserResponseDto } from '../../dtos/users';
import type { IUsersRepository } from '../../../domain/interfaces/users-repository.interface';
import { USERS_REPOSITORY } from '../../../infrastructure/repositories.constants';

@Injectable()
export class GetAllUsersUseCase {
  private readonly logger = new Logger(GetAllUsersUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<GlobalResponseDto<UserResponseDto[]>> {
    try {
      this.logger.log('GetAllUsersUseCase: fetching all users');

      const users = await this.usersRepository.findAll();
      const data = users.map(UserResponseDto.fromDomain);

      return GlobalResponseDto.success(data);
    } catch (error) {
      this.logger.error('GetAllUsersUseCase failed', error);
      throw error;
    }
  }
}
