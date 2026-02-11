import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

/**
 * TypeORM entity for shifts (MongoDB). Used only in infrastructure.
 * Mapping to domain entity Shift is done in the repository.
 */
@Entity('shifts')
export class ShiftOrmEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  employeeId: string;

  @Column({ type: 'date' })
  startAt: Date;

  @Column({ type: 'date' })
  endAt: Date;

  @Column({ nullable: true })
  position?: string;

  @Column({ type: 'date', default: () => new Date() })
  createdAt: Date;

  @Column({ type: 'date', default: () => new Date() })
  updatedAt: Date;
}
