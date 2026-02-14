import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../../../application/dtos/users';
import { GetAllUsersUseCase, CreateUserUseCase } from '../../../application/use-cases/users';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll() {
    this.logger.log('findAll called');
    return this.getAllUsersUseCase.execute();
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'User with email already exists' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() body: CreateUserDto) {
    this.logger.log('create called', { email: body.email });
    return this.createUserUseCase.execute(body);
  }
}
