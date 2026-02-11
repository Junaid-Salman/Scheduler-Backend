import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { GlobalResponseDto } from '../../dtos/common';
import type { ISchedulerRepository } from '../../../domain/interfaces/scheduler-repository.interface';
import { SCHEDULER_REPOSITORY } from '../../../infrastructure/repositories.constants';

@Injectable()
export class DeleteShiftUseCase {
  private readonly logger = new Logger(DeleteShiftUseCase.name);

  constructor(
    @Inject(SCHEDULER_REPOSITORY)
    private readonly schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(id: string): Promise<GlobalResponseDto<{ deleted: boolean }>> {
    try {
      this.logger.log('DeleteShiftUseCase: deleting shift', { id });

      const deleted = await this.schedulerRepository.delete(id);

      if (!deleted) {
        throw new NotFoundException(`Shift with id ${id} not found`);
      }

      return GlobalResponseDto.success({ deleted: true });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('DeleteShiftUseCase failed', error);
      throw error;
    }
  }
}
