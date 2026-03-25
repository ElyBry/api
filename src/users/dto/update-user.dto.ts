import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  full_name?: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  phone?: string;
}
