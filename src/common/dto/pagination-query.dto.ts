import { ApiPropertyOptional } from '@nestjs/swagger';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Номер страницы' })
  page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100, description: 'Записей на странице' })
  limit?: number;
}

export function getPaginationParams(page?: number, limit?: number) {
  const p = Math.max(1, Math.floor(Number(page)) || DEFAULT_PAGE);
  const l = Math.min(
    MAX_LIMIT,
    Math.max(1, Math.floor(Number(limit)) || DEFAULT_LIMIT),
  );
  return {
    limit: l,
    offset: (p - 1) * l,
  };
}
