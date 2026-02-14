import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import type { IRefreshTokenRepository } from '../../../domain/interfaces/refresh-token-repository.interface';
import { RefreshTokenOrmEntity } from '../entities/refresh-token.orm-entity';

@Injectable()
export class TypeOrmRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly tokenRepository: Repository<RefreshTokenOrmEntity>,
  ) {}

  async save(data: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void> {
    const userId = parseInt(data.userId, 10);
    if (Number.isNaN(userId)) return;
    const entity = this.tokenRepository.create({
      userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
    });
    await this.tokenRepository.save(entity);
  }

  async findValid(tokenHash: string): Promise<{ userId: string } | null> {
    const entity = await this.tokenRepository.findOne({
      where: {
        tokenHash,
        expiresAt: MoreThan(new Date()),
      },
    });
    return entity ? { userId: String(entity.userId) } : null;
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.tokenRepository.delete({ tokenHash });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    const numericId = parseInt(userId, 10);
    if (Number.isNaN(numericId)) return;
    await this.tokenRepository.delete({ userId: numericId });
  }
}
