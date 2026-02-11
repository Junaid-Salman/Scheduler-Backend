import { Controller, Get, Post, Patch, Delete, Param, Query, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  GetShiftsQueryDto,
  CreateShiftDto,
  UpdateShiftDto,
} from '../../../application/dtos/scheduler';
import {
  GetAllShiftsUseCase,
  GetShiftByIdUseCase,
  CreateShiftUseCase,
  UpdateShiftUseCase,
  DeleteShiftUseCase,
} from '../../../application/use-cases/scheduler';

@ApiTags('Scheduler')
@Controller('scheduler')
export class SchedulerController {
  private readonly logger = new Logger(SchedulerController.name);

  constructor(
    private readonly getAllShiftsUseCase: GetAllShiftsUseCase,
    private readonly getShiftByIdUseCase: GetShiftByIdUseCase,
    private readonly createShiftUseCase: CreateShiftUseCase,
    private readonly updateShiftUseCase: UpdateShiftUseCase,
    private readonly deleteShiftUseCase: DeleteShiftUseCase,
  ) {}

  @Get('shifts')
  @ApiOperation({ summary: 'Get all shifts with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of shifts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async getAllShifts(@Query() query: GetShiftsQueryDto) {
    this.logger.log('getAllShifts called', { query: query });
    const pagination = {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
    return this.getAllShiftsUseCase.execute(pagination);
  }

  @Get('shifts/:id')
  @ApiOperation({ summary: 'Get a shift by id' })
  @ApiResponse({ status: 200, description: 'Shift found' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  async getShiftById(@Param('id') id: string) {
    this.logger.log('getShiftById called', { id });
    return this.getShiftByIdUseCase.execute(id);
  }

  @Post('shifts')
  @ApiOperation({ summary: 'Create a shift' })
  @ApiResponse({ status: 201, description: 'Shift created' })
  @ApiBody({ type: CreateShiftDto })
  async createShift(@Body() body: CreateShiftDto) {
    this.logger.log('createShift called', { employeeId: body.employeeId });
    return this.createShiftUseCase.execute(body);
  }

  @Patch('shifts/:id')
  @ApiOperation({ summary: 'Update a shift' })
  @ApiResponse({ status: 200, description: 'Shift updated' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  @ApiBody({ type: UpdateShiftDto })
  async updateShift(@Param('id') id: string, @Body() body: UpdateShiftDto) {
    this.logger.log('updateShift called', { id });
    return this.updateShiftUseCase.execute(id, body);
  }

  @Delete('shifts/:id')
  @ApiOperation({ summary: 'Delete a shift' })
  @ApiResponse({ status: 200, description: 'Shift deleted' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  async deleteShift(@Param('id') id: string) {
    this.logger.log('deleteShift called', { id });
    return this.deleteShiftUseCase.execute(id);
  }
}
