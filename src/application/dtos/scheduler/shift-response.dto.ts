import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Shift } from '../../../domain/entities';

export class ShiftResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;

  @ApiPropertyOptional()
  position?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(shift: Shift): ShiftResponseDto {
    const dto = new ShiftResponseDto();
    dto.id = shift.id;
    dto.employeeId = shift.employeeId;
    dto.startAt = shift.startAt;
    dto.endAt = shift.endAt;
    dto.position = shift.position;
    dto.createdAt = shift.createdAt;
    dto.updatedAt = shift.updatedAt;
    return dto;
  }
}
