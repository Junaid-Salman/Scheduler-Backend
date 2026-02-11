import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { GlobalResponseDto } from '../../dtos/common';
import { UpdateShiftDto } from '../../dtos/scheduler';
import { ShiftResponseDto } from '../../dtos/scheduler';
import type { ISchedulerRepository } from '../../../domain/interfaces/scheduler-repository.interface';
import { SCHEDULER_REPOSITORY } from '../../../infrastructure/repositories.constants';

@Injectable()
export class UpdateShiftUseCase {
  private readonly logger = new Logger(UpdateShiftUseCase.name);

  constructor(
    @Inject(SCHEDULER_REPOSITORY)
    private readonly schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateShiftDto,
  ): Promise<GlobalResponseDto<ShiftResponseDto>> {
    try {
      this.logger.log('UpdateShiftUseCase: updating shift', { id });

      const data: { employeeId?: string; startAt?: Date; endAt?: Date; position?: string } = {};
      if (dto.employeeId !== undefined) data.employeeId = dto.employeeId;
      if (dto.startAt !== undefined) data.startAt = new Date(dto.startAt);
      if (dto.endAt !== undefined) data.endAt = new Date(dto.endAt);
      if (dto.position !== undefined) data.position = dto.position;

      const shift = await this.schedulerRepository.update(id, data);

      if (!shift) {
        throw new NotFoundException(`Shift with id ${id} not found`);
      }

      return GlobalResponseDto.success(ShiftResponseDto.fromDomain(shift));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('UpdateShiftUseCase failed', error);
      throw error;
    }
  }
}
