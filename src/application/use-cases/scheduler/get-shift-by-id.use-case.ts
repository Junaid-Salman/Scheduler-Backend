import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { GlobalResponseDto } from '../../dtos/common';
import { ShiftResponseDto } from '../../dtos/scheduler';
import type { ISchedulerRepository } from '../../../domain/interfaces/scheduler-repository.interface';
import { SCHEDULER_REPOSITORY } from '../../../infrastructure/repositories.constants';

@Injectable()
export class GetShiftByIdUseCase {
  private readonly logger = new Logger(GetShiftByIdUseCase.name);

  constructor(
    @Inject(SCHEDULER_REPOSITORY)
    private readonly schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(id: string): Promise<GlobalResponseDto<ShiftResponseDto>> {
    try {
      this.logger.log('GetShiftByIdUseCase: fetching shift', { id });

      const shift = await this.schedulerRepository.findById(id);

      if (!shift) {
        throw new NotFoundException(`Shift with id ${id} not found`);
      }

      return GlobalResponseDto.success(ShiftResponseDto.fromDomain(shift));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('GetShiftByIdUseCase failed', error);
      throw error;
    }
  }
}
