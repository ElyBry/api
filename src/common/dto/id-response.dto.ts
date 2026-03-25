import { ApiProperty } from '@nestjs/swagger';

export class IdResponseDto {
  @ApiProperty({ example: 1, description: 'ID созданной записи' })
  id: number;
}
