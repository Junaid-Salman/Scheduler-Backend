import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import type { IUsersRepository } from '../../../domain/interfaces/users-repository.interface';
import { User } from '../../../domain/entities';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class TypeOrmUsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: MongoRepository<UserOrmEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.userRepository.find();
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: string): Promise<User | null> {
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return null;
    }
    const entity = await this.userRepository.findOne({
      where: { _id: objectId },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { email },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async create(data: { name: string; email: string }): Promise<User> {
    const entity = this.userRepository.create({
      name: data.name,
      email: data.email,
    });
    const saved = await this.userRepository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(orm: UserOrmEntity): User {
    return {
      id: orm._id.toString(),
      name: orm.name,
      email: orm.email,
    };
  }
}
