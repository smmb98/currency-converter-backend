import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CurrenciesDto {
  @ApiPropertyOptional({ description: 'Comma-separated currency codes' })
  @IsString()
  @IsOptional()
  currencies?: string;
}