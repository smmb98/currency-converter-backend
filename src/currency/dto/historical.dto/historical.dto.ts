import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HistoricalDto {
  @ApiProperty({ description: 'Base currency code (e.g., USD)' })
  @IsString()
  @IsNotEmpty()
  base!: string;

  @ApiProperty({ description: 'Date (YYYY-MM-DD)' })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({ description: 'Comma-separated currency codes' })
  @IsString()
  @IsOptional()
  currencies?: string;
}