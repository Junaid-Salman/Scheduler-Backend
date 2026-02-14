import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { IUsersRepository } from '../../../domain/interfaces/users-repository.interface';
import { USERS_REPOSITORY } from '../../../infrastructure/repositories.constants';
import { Inject } from '@nestjs/common';
import type { User } from '../../../domain/entities';

/**
 * JWT payload includes user info (name, email) so we can avoid DB hit on every request.
 * We still validate that the user exists when loading the profile.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface RequestUser extends User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'default-secret-change-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.usersRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
