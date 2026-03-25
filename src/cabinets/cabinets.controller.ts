import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common/pipes';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CabinetsService } from './cabinets.service';
import type { CabinetRow } from './cabinets.service';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';
import { CabinetResponseDto } from './dto/cabinet-response.dto';
import { IdResponseDto } from '../common/dto/id-response.dto';
import { getPaginationParams } from '../common/dto/pagination-query.dto';

@ApiTags('Cabinets')
@Controller('cabinets')
export class CabinetsController {
  constructor(private readonly cabinetsService: CabinetsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать шкаф' })
  @ApiBody({ type: CreateCabinetDto })
  @ApiResponse({ status: 201, description: 'Созданный шкаф', type: CabinetResponseDto })
  create(@Body() payload: CreateCabinetDto) {
    return this.cabinetsService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Список шкафов (пагинация)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [CabinetResponseDto] })
  getCabinets(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<CabinetRow[]> {
    const { limit: l, offset } = getPaginationParams(page, limit);
    return this.cabinetsService.findAll(l, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Шкаф по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: CabinetResponseDto })
  @ApiResponse({ status: 404, description: 'Не найден' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.cabinetsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить шкаф' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCabinetDto })
  @ApiResponse({ status: 200, type: CabinetResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCabinetDto,
  ) {
    return this.cabinetsService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить шкаф (soft)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: IdResponseDto })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.cabinetsService.softDelete(id);
  }
}
