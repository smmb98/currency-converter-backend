import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, IsUppercase, Length } from 'class-validator';

export class HistoricalDto {
  @ApiProperty({ description: 'Base currency code (e.g., USD)', example: 'USD' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value))
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Length(3, 3)
  base!: string;

  @ApiProperty({ description: 'Date in YYYY-MM-DD format', example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;
}
