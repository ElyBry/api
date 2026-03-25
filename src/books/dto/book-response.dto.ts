import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ example: 'Война и мир', nullable: true })
  title: string | null;

  @ApiPropertyOptional({ example: 'Л. Н. Толстой', nullable: true })
  author: string | null;

  @ApiProperty({ example: '978-5-17-090666-1' })
  isbn: string;

  @ApiPropertyOptional({ example: 1869, nullable: true })
  publication_year: number | null;

  @ApiProperty({ example: false })
  is_deleted: boolean;
}
