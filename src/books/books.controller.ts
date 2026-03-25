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
import { BooksService } from './books.service';
import type { BookRow } from './books.service';
import type { BooksFilterDto } from './dto/books-filter.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { IdResponseDto } from '../common/dto/id-response.dto';
import { getPaginationParams } from '../common/dto/pagination-query.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Создать книгу (обязателен только isbn)' })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({ status: 201, description: 'Созданная книга', type: BookResponseDto })
  create(@Body() payload: CreateBookDto) {
    return this.booksService.create(payload);
  }

  @Get()
  @ApiOperation({
    summary: 'Список книг',
    description:
      'Пагинация (page, limit) + опциональные фильтры: isbn, title, author, publication_year, onlyWithTitle. Можно комбинировать.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isbn', required: false, type: String })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'author', required: false, type: String })
  @ApiQuery({ name: 'publication_year', required: false, type: Number })
  @ApiQuery({ name: 'onlyWithTitle', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [BookResponseDto] })
  getBooks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('isbn') isbn?: string,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('publication_year') publication_year?: string,
    @Query('onlyWithTitle') onlyWithTitle?: string,
  ): Promise<BookRow[]> {
    const { limit: l, offset } = getPaginationParams(page, limit);
    const year = publication_year ? parseInt(publication_year, 10) : undefined;
    const filterObj: Record<string, unknown> = {};
    if (isbn) filterObj.isbn = isbn;
    if (title) filterObj.title = title;
    if (author) filterObj.author = author;
    if (year != null && !Number.isNaN(year)) filterObj.publication_year = year;
    if (onlyWithTitle === 'true') filterObj.onlyWithTitle = true;
    const filter: BooksFilterDto | undefined =
      Object.keys(filterObj).length > 0 ? (filterObj as BooksFilterDto) : undefined;
    return this.booksService.findAll(l, offset, filter);
  }

  @Get('by-isbn/:isbn')
  @ApiOperation({ summary: 'Книга по ISBN' })
  @ApiParam({ name: 'isbn', description: 'ISBN книги' })
  @ApiResponse({ status: 200, type: BookResponseDto })
  @ApiResponse({ status: 404, description: 'Не найдена' })
  getByIsbn(@Param('isbn') isbn: string) {
    return this.booksService.findByIsbn(isbn);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Книга по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: BookResponseDto })
  @ApiResponse({ status: 404, description: 'Не найдена' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить книгу' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({ status: 200, type: BookResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ) {
    return this.booksService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить книгу (soft)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: IdResponseDto })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.softDelete(id);
  }
}
