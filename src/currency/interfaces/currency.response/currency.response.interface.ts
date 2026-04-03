export interface CurrencyRate {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
}

export interface LatestResponse {
  data: Record<string, number>;
}

export interface HistoricalResponse {
  data: Record<string, number>;
}

export interface CurrenciesResponse {
  data: Record<string, CurrencyRate>;
}