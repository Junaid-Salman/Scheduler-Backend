/**
 * All database tables/collections are defined as entities in this directory.
 * Register new entities here and in the ormEntities array so they are
 * included in TypeORM configuration.
 */
import { ShiftOrmEntity } from './shift.orm-entity';
import { UserOrmEntity } from './user.orm-entity';
import { RefreshTokenOrmEntity } from './refresh-token.orm-entity';

export { ShiftOrmEntity } from './shift.orm-entity';
export { UserOrmEntity } from './user.orm-entity';
export { RefreshTokenOrmEntity } from './refresh-token.orm-entity';

/** All ORM entities – single source of truth for "schema" (use in TypeOrmModule.forRoot) */
export const ormEntities = [ShiftOrmEntity, UserOrmEntity, RefreshTokenOrmEntity];
