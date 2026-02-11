import { Shift } from '../entities';
import { IPagination, IPaginatedResponse, IFilters } from './pagination.interface';

export interface CreateShiftData {
  employeeId: string;
  startAt: Date;
  endAt: Date;
  position?: string;
}

export interface UpdateShiftData {
  employeeId?: string;
  startAt?: Date;
  endAt?: Date;
  position?: string;
}

/**
 * Domain repository interface for Scheduler/Shifts.
 * Use-cases depend on this interface; infrastructure provides the implementation.
 */
export interface ISchedulerRepository {
  findAll(pagination: IPagination, filters?: IFilters): Promise<IPaginatedResponse<Shift>>;

  findById(id: string): Promise<Shift | null>;

  create(data: CreateShiftData): Promise<Shift>;

  update(id: string, data: UpdateShiftData): Promise<Shift | null>;

  delete(id: string): Promise<boolean>;
}
