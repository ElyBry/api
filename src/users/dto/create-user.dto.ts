import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван Иванов', description: 'ФИО' })
  full_name: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email' })
  email: string;

  @ApiPropertyOptional({ example: '+7 999 123-45-67', description: 'Телефон' })
  phone?: string;
}
