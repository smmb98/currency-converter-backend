import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LatestDto {
  @ApiProperty({ description: 'Base currency code (e.g., USD)' })
  @IsString()
  @IsNotEmpty()
  base!: string;

  @ApiPropertyOptional({ description: 'Comma-separated currency codes' })
  @IsString()
  @IsOptional()
  currencies?: string;
}