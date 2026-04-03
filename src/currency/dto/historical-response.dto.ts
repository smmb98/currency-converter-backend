import { ApiProperty } from '@nestjs/swagger';

export class HistoricalResponseDto {
  @ApiProperty({
    description: 'Map of date to map of currency code to exchange rate',
    example: { '2024-01-15': { USD: 1, EUR: 0.913, PKR: 280.1 } },
  })
  data!: Record<string, Record<string, number>>;
}
