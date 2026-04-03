import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, IsUppercase, Length } from 'class-validator';

export class HistoricalDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value))
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Length(3, 3)
  base!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;
}
