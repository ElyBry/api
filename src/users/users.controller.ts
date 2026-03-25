import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DefaultValuePipe } from '@nestjs/common/pipes';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import type { UserRow } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { IdResponseDto } from '../common/dto/id-response.dto';
import { getPaginationParams } from '../common/dto/pagination-query.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Создать читателя',
    description: 'Принимает full_name, email и опционально phone. Возвращает созданного читателя.',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example: {
        summary: 'Пример запроса',
        value: {
          full_name: 'Иван Иванов',
          email: 'ivan@example.com',
          phone: '+7 999 123-45-67',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Созданный читатель', type: UserResponseDto })
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Get()
  @ApiOperation({
    summary: 'Список читателей',
    description: 'Возвращает читателей с пагинацией (is_deleted = false).',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Массив читателей',
    type: [UserResponseDto],
  })
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<UserRow[]> {
    const { limit: l, offset } = getPaginationParams(page, limit);
    return this.usersService.findAll(l, offset);
  }

  @Get('deleted')
  @ApiOperation({
    summary: 'Удалённые читатели',
    description: 'Возвращает читателей с пагинацией (is_deleted = true).',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Массив удалённых читателей',
    type: [UserResponseDto],
  })
  getDeletedUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<UserRow[]> {
    const { limit: l, offset } = getPaginationParams(page, limit);
    return this.usersService.findDeleted(l, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Читатель по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Не найден' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить читателя' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(id, payload);
  }

  @Delete(':user_id')
  @ApiOperation({
    summary: 'Удалить читателя (soft delete)',
    description: 'Устанавливает is_deleted = true для читателя с указанным ID.',
  })
  @ApiParam({ name: 'user_id', example: 1, description: 'ID читателя' })
  @ApiResponse({
    status: 200,
    description: 'ID удалённого читателя',
    type: IdResponseDto,
  })
  deleteUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.usersService.softDelete(user_id);
  }
}
