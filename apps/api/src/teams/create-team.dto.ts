import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Squad Plataforma' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'Time de infraestrutura' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
