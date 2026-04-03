import { ApiProperty } from '@nestjs/swagger';
import { CurrencyMetaDto } from './currency-meta.dto';

export class CurrenciesResponseDto {
  @ApiProperty({
    description: 'Map of currency code to currency metadata',
    type: 'object',
    additionalProperties: { $ref: '#/components/schemas/CurrencyMetaDto' },
  })
  data!: Record<string, CurrencyMetaDto>;
}
