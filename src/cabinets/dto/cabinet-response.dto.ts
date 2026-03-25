import { ApiProperty } from '@nestjs/swagger';

export class CabinetResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'A-101' })
  number: string;

  @ApiProperty({ example: false })
  is_deleted: boolean;
}
