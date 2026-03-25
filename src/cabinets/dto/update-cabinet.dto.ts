import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCabinetDto {
  @ApiPropertyOptional({ example: 'A-102' })
  number?: string;
}
