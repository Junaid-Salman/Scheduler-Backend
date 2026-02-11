import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

/**
 * TypeORM entity for users (MongoDB). Used only in infrastructure.
 * Mapping to domain entity User is done in the repository.
 */
@Entity('users')
export class UserOrmEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;
}
