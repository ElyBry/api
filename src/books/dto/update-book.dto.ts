import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiPropertyOptional()
  isbn?: string;
  @ApiPropertyOptional()
  title?: string;
  @ApiPropertyOptional()
  author?: string;
  @ApiPropertyOptional()
  publication_year?: number;
}
