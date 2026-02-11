import { Injectable, Inject, Logger } from '@nestjs/common';
import { GlobalResponseDto } from '../../dtos/common';
import { CreateShiftDto } from '../../dtos/scheduler';
import { ShiftResponseDto } from '../../dtos/scheduler';
import type { ISchedulerRepository } from '../../../domain/interfaces/scheduler-repository.interface';
import { SCHEDULER_REPOSITORY } from '../../../infrastructure/repositories.constants';

@Injectable()
export class CreateShiftUseCase {
  private readonly logger = new Logger(CreateShiftUseCase.name);

  constructor(
    @Inject(SCHEDULER_REPOSITORY)
    private readonly schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(dto: CreateShiftDto): Promise<GlobalResponseDto<ShiftResponseDto>> {
    try {
      this.logger.log('CreateShiftUseCase: creating shift', {
        employeeId: dto.employeeId,
        startAt: dto.startAt,
        endAt: dto.endAt,
      });

      const shift = await this.schedulerRepository.create({
        employeeId: dto.employeeId,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        position: dto.position,
      });

      return GlobalResponseDto.success(ShiftResponseDto.fromDomain(shift));
    } catch (error) {
      this.logger.error('CreateShiftUseCase failed', error);
      throw error;
    }
  }
}
