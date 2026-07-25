import { Injectable } from '@nestjs/common';
import type { IRefreshTokenRepository } from '../../../domain/interfaces/refresh-token-repository.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void> {
    const userId = parseInt(data.userId, 10);
    if (Number.isNaN(userId)) return;
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findValid(tokenHash: string): Promise<{ userId: string } | null> {
    const entity = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });
    return entity ? { userId: String(entity.userId) } : null;
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { tokenHash } });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    const numericId = parseInt(userId, 10);
    if (Number.isNaN(numericId)) return;
    await this.prisma.refreshToken.deleteMany({ where: { userId: numericId } });
  }
}
