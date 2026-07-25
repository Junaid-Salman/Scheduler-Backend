import { Injectable } from '@nestjs/common';
import { Prisma, Shift as PrismaShift } from '@prisma/client';
import type {
  ISchedulerRepository,
  CreateShiftData,
  UpdateShiftData,
} from '../../../domain/interfaces/scheduler-repository.interface';
import { Shift } from '../../../domain/entities';
import { IPagination, IPaginatedResponse, IFilters } from '../../../domain/interfaces/pagination.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSchedulerRepository implements ISchedulerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    pagination: IPagination,
    filters?: IFilters,
  ): Promise<IPaginatedResponse<Shift>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const skip = (page - 1) * limit;

    const orderBy = {
      [this.sanitizeSortField(sortBy)]: sortOrder.toLowerCase() as Prisma.SortOrder,
    };

    const where: Prisma.ShiftWhereInput = {};
    if (filters?.employeeId) {
      where.employeeId = filters.employeeId as string;
    }

    const [items, total] = await Promise.all([
      this.prisma.shift.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.shift.count({ where }),
    ]);

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
    const entity = await this.prisma.shift.findUnique({ where: { id: numericId } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(data: CreateShiftData): Promise<Shift> {
    const entity = await this.prisma.shift.create({
      data: {
        employeeId: data.employeeId,
        startAt: data.startAt,
        endAt: data.endAt,
        position: data.position,
      },
    });
    return this.toDomain(entity);
  }

  async update(id: string, data: UpdateShiftData): Promise<Shift | null> {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) return null;
    const existing = await this.prisma.shift.findUnique({ where: { id: numericId } });
    if (!existing) return null;
    const updated = await this.prisma.shift.update({
      where: { id: numericId },
      data: {
        employeeId: data.employeeId,
        startAt: data.startAt,
        endAt: data.endAt,
        position: data.position,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) return false;
    const existing = await this.prisma.shift.findUnique({ where: { id: numericId } });
    if (!existing) return false;
    await this.prisma.shift.delete({ where: { id: numericId } });
    return true;
  }

  private toDomain(entity: PrismaShift): Shift {
    return {
      id: String(entity.id),
      employeeId: entity.employeeId,
      startAt: entity.startAt,
      endAt: entity.endAt,
      position: entity.position ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private sanitizeSortField(field: string): string {
    const allowed = ['startAt', 'endAt', 'createdAt', 'employeeId'];
    return allowed.includes(field) ? field : 'createdAt';
  }
}
