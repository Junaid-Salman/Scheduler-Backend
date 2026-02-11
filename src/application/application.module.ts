import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../infrastructure/repositories.module';
import {
  GetAllShiftsUseCase,
  GetShiftByIdUseCase,
  CreateShiftUseCase,
  UpdateShiftUseCase,
  DeleteShiftUseCase,
} from './use-cases/scheduler';
import { GetAllUsersUseCase, CreateUserUseCase } from './use-cases/users';

@Module({
  imports: [RepositoriesModule],
  providers: [
    GetAllShiftsUseCase,
    GetShiftByIdUseCase,
    CreateShiftUseCase,
    UpdateShiftUseCase,
    DeleteShiftUseCase,
    GetAllUsersUseCase,
    CreateUserUseCase,
  ],
  exports: [
    GetAllShiftsUseCase,
    GetShiftByIdUseCase,
    CreateShiftUseCase,
    UpdateShiftUseCase,
    DeleteShiftUseCase,
    GetAllUsersUseCase,
    CreateUserUseCase,
  ],
})
export class ApplicationModule {}
