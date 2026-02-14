import { User } from '../entities';

/**
 * Domain repository interface for Users.
 * Use-cases depend on this interface; infrastructure provides the implementation.
 */
export interface IUsersRepository {
  findAll(): Promise<User[]>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  create(data: { name: string; email: string; passwordHash: string }): Promise<User>;
}
