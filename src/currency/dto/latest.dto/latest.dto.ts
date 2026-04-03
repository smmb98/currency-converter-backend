import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUppercase, Length } from 'class-validator';

export class LatestDto {
  @ApiProperty({ description: 'Base currency code (e.g., USD)', example: 'USD' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value))
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Length(3, 3)
  base!: string;
}
