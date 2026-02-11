import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standard API response wrapper for consistent response structure.
 * Use GlobalResponseDto.success() and GlobalResponseDto.error() in use-cases.
 */
export class GlobalResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiPropertyOptional({ description: 'Response payload when success is true' })
  data?: T;

  @ApiPropertyOptional({ description: 'Error message when success is false' })
  message?: string;

  @ApiPropertyOptional({ description: 'Optional error code' })
  errorCode?: string;

  private constructor(success: boolean, data?: T, message?: string, errorCode?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errorCode = errorCode;
  }

  static success<T>(data: T): GlobalResponseDto<T> {
    return new GlobalResponseDto<T>(true, data);
  }

  static error(message: string, errorCode?: string): GlobalResponseDto<never> {
    return new GlobalResponseDto<never>(false, undefined, message, errorCode);
  }
}
