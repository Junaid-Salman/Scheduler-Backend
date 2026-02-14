import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import type {
  ISchedulerRepository,
  CreateShiftData,
  UpdateShiftData,
} from '../../../domain/interfaces/scheduler-repository.interface';
import { Shift } from '../../../domain/entities';
import { IPagination, IPaginatedResponse, IFilters } from '../../../domain/interfaces/pagination.interface';
import { ShiftOrmEntity } from '../entities/shift.orm-entity';

@Injectable()
export class TypeOrmSchedulerRepository implements ISchedulerRepository {
  constructor(
    @InjectRepository(ShiftOrmEntity)
    private readonly shiftRepository: Repository<ShiftOrmEntity>,
  ) {}

  async findAll(
    pagination: IPagination,
    filters?: IFilters,
  ): Promise<IPaginatedResponse<Shift>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const skip = (page - 1) * limit;

    const order = { [this.sanitizeSortField(sortBy)]: sortOrder } as const;
    const where: Record<string, unknown> = {};
    if (filters?.employeeId) {
      where.employeeId = filters.employeeId;
    }

    const [items, total] = await this.shiftRepository.findAndCount({
      where,
      order,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((e) => this.toDomain(e)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async findById(id: string): Promise<Shift | null> {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) return null;
    const entity = await this.shiftRepository.findOne({ where: { id: numericId } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(data: CreateShiftData): Promise<Shift> {
    const entity = this.shiftRepository.create({
      employeeId: data.employeeId,
      startAt: data.startAt,
      endAt: data.endAt,
      position: data.position,
    });
    const saved = await this.shiftRepository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, data: UpdateShiftData): Promise<Shift | null> {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) return null;
    const entity = await this.shiftRepository.findOne({ where: { id: numericId } });
    if (!entity) return null;
    if (data.employeeId !== undefined) entity.employeeId = data.employeeId;
    if (data.startAt !== undefined) entity.startAt = data.startAt;
    if (data.endAt !== undefined) entity.endAt = data.endAt;
    if (data.position !== undefined) entity.position = data.position;
    const saved = await this.shiftRepository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) return false;
    const result = await this.shiftRepository.delete({ id: numericId });
    return (result.affected ?? 0) > 0;
  }

  private toDomain(orm: ShiftOrmEntity): Shift {
    return {
      id: String(orm.id),
      employeeId: orm.employeeId,
      startAt: orm.startAt,
      endAt: orm.endAt,
      position: orm.position,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }

  private sanitizeSortField(field: string): string {
    const allowed = ['startAt', 'endAt', 'createdAt', 'employeeId'];
    return allowed.includes(field) ? field : 'createdAt';
  }
}
