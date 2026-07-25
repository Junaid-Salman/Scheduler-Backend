import { Injectable } from '@nestjs/common';
import type { IUsersRepository } from '../../../domain/interfaces/users-repository.interface';
import { User } from '../../../domain/entities';
import { PrismaService } from '../prisma.service';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.toDomain(u));
  }

  async findById(id: string): Promise<User | null> {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) return null;
    const user = await this.prisma.user.findUnique({ where: { id: numericId } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async create(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    const user = await this.prisma.user.create({ data });
    return this.toDomain(user);
  }

  private toDomain(user: PrismaUser): User {
    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
    };
  }
}
