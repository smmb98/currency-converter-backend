import { CurrencyMetaDto } from './currency-meta.dto';

export class CurrenciesResponseDto {
  data!: Record<string, CurrencyMetaDto>;
}
