import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Иван Иванов' })
  full_name: string;

  @ApiProperty({ example: 'ivan@example.com' })
  email: string;

  @ApiPropertyOptional({ example: '+7 999 123-45-67', nullable: true })
  phone: string | null;

  @ApiProperty({ example: false })
  is_deleted: boolean;
}
