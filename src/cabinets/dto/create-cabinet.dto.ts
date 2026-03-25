import { ApiProperty } from '@nestjs/swagger';

export class CreateCabinetDto {
  @ApiProperty({ example: 'A-101', description: 'Номер шкафа' })
  number: string;
}
