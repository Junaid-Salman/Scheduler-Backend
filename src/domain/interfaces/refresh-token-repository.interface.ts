/**
 * Domain interface for storing and validating refresh tokens.
 */
export interface IRefreshTokenRepository {
  save(data: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void>;
  findValid(tokenHash: string): Promise<{ userId: string } | null>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}
