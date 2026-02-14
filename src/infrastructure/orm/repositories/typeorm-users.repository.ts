import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUsersRepository } from '../../../domain/interfaces/users-repository.interface';
import { User } from '../../../domain/entities';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class TypeOrmUsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.userRepository.find();
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: string): Promise<User | null> {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) return null;
    const entity = await this.userRepository.findOne({ where: { id: numericId } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    const entity = this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
    });
    const saved = await this.userRepository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(orm: UserOrmEntity): User {
    return {
      id: String(orm.id),
      name: orm.name,
      email: orm.email,
      passwordHash: orm.passwordHash,
    };
  }
}
