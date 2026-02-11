import { Injectable, Inject, Logger } from '@nestjs/common';
import { GlobalResponseDto } from '../../dtos/common';
import { ShiftResponseDto } from '../../dtos/scheduler';
import type { ISchedulerRepository } from '../../../domain/interfaces/scheduler-repository.interface';
import { IPagination, IPaginatedResponse } from '../../../domain/interfaces/pagination.interface';
import { Shift } from '../../../domain/entities';
import { SCHEDULER_REPOSITORY } from '../../../infrastructure/repositories.constants';

export interface GetAllShiftsResult {
  items: ShiftResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Injectable()
export class GetAllShiftsUseCase {
  private readonly logger = new Logger(GetAllShiftsUseCase.name);

  constructor(
    @Inject(SCHEDULER_REPOSITORY)
    private readonly schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(pagination: IPagination): Promise<GlobalResponseDto<GetAllShiftsResult>> {
    try {
      this.logger.log('GetAllShiftsUseCase: fetching shifts', {
        page: pagination.page,
        limit: pagination.limit,
      });

      const result: IPaginatedResponse<Shift> =
        await this.schedulerRepository.findAll(pagination);

      const data: GetAllShiftsResult = {
        items: result.items.map(ShiftResponseDto.fromDomain),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
      };

      return GlobalResponseDto.success(data);
    } catch (error) {
      this.logger.error('GetAllShiftsUseCase failed', error);
      throw error;
    }
  }
}
