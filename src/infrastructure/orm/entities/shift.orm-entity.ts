import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM entity for shifts (PostgreSQL). Used only in infrastructure.
 * Mapping to domain entity Shift is done in the repository.
 */
@Entity('shifts')
export class ShiftOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: string;

  @Column({ type: 'timestamptz' })
  startAt: Date;

  @Column({ type: 'timestamptz' })
  endAt: Date;

  @Column({ nullable: true })
  position?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
