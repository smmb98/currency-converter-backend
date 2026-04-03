import { ApiProperty } from '@nestjs/swagger';

export class CurrencyMetaDto {
  @ApiProperty({ example: '$' })
  symbol!: string;

  @ApiProperty({ example: 'US Dollar' })
  name!: string;

  @ApiProperty({ example: '$' })
  symbol_native!: string;

  @ApiProperty({ example: 2 })
  decimal_digits!: number;

  @ApiProperty({ example: 0 })
  rounding!: number;

  @ApiProperty({ example: 'USD' })
  code!: string;

  @ApiProperty({ example: 'US dollars' })
  name_plural!: string;

  @ApiProperty({ example: 'fiat' })
  type!: string;
}
