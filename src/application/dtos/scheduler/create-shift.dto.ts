import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @MinLength(1)
  employeeId: string;

  @ApiProperty({ example: '2025-02-10T09:00:00.000Z' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2025-02-10T17:00:00.000Z' })
  @IsDateString()
  endAt: string;

  @ApiPropertyOptional({ example: 'Barista' })
  @IsOptional()
  @IsString()
  position?: string;
}
