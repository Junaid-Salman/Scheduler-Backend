import * as bcrypt from 'bcrypt';
import { Injectable, Inject, Logger, ConflictException } from '@nestjs/common';
import { GlobalResponseDto } from '../../dtos/common';
import { CreateUserDto } from '../../dtos/users';
import { UserResponseDto } from '../../dtos/users';
import type { IUsersRepository } from '../../../domain/interfaces/users-repository.interface';
import { USERS_REPOSITORY } from '../../../infrastructure/repositories.constants';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(
    dto: CreateUserDto,
  ): Promise<GlobalResponseDto<UserResponseDto>> {
    try {
      this.logger.log('CreateUserUseCase: creating user', { email: dto.email });

      const existing = await this.usersRepository.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException(`User with email ${dto.email} already exists`);
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await this.usersRepository.create({
        name: dto.name,
        email: dto.email,
        passwordHash,
      });

      return GlobalResponseDto.success(UserResponseDto.fromDomain(user));
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('CreateUserUseCase failed', error);
      throw error;
    }
  }
}
