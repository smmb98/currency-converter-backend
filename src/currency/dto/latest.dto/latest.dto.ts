import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUppercase, Length } from 'class-validator';

export class LatestDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value))
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Length(3, 3)
  base!: string;
}
