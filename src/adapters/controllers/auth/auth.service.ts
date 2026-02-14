import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { IUsersRepository } from '../../../domain/interfaces/users-repository.interface';
import type { IRefreshTokenRepository } from '../../../domain/interfaces/refresh-token-repository.interface';
import { USERS_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from '../../../infrastructure/repositories.constants';
import type { User } from '../../../domain/entities';
import type { SignUpDto, LoginDto } from './auth.dto';
import type { TokensResponseDto } from './auth.dto';
import type { JwtPayload } from './jwt.strategy';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<{ user: { id: string; name: string; email: string }; tokens: TokensResponseDto }> {
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
    const tokens = await this.issueTokens(user);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<{ user: { id: string; name: string; email: string }; tokens: TokensResponseDto }> {
    const user = await this.validateUser(dto.email, dto.password);
    const tokens = await this.issueTokens(user);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokensResponseDto> {
    const hash = this.hashRefreshToken(refreshToken);
    const record = await this.refreshTokenRepository.findValid(hash);
    if (!record) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const user = await this.usersRepository.findById(record.userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    await this.refreshTokenRepository.deleteByTokenHash(hash);
    return this.issueTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const hash = this.hashRefreshToken(refreshToken);
    await this.refreshTokenRepository.deleteByTokenHash(hash);
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  private async issueTokens(user: User): Promise<TokensResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const decoded = this.jwtService.decode(accessToken) as { exp: number };
    const expiresIn = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 900;

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshHash = this.hashRefreshToken(refreshToken);
    const refreshExpires = new Date();
    refreshExpires.setDate(refreshExpires.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    await this.refreshTokenRepository.save({
      userId: user.id,
      tokenHash: refreshHash,
      expiresAt: refreshExpires,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
