import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: '978-5-17-090666-1', description: 'ISBN (обязательно)' })
  isbn: string;

  @ApiPropertyOptional({ example: 'Война и мир', description: 'Название книги' })
  title?: string;

  @ApiPropertyOptional({ example: 'Л. Н. Толстой', description: 'Автор' })
  author?: string;

  @ApiPropertyOptional({ example: 1869, description: 'Год издания' })
  publication_year?: number;
}
