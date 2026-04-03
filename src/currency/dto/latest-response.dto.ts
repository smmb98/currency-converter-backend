import { ApiProperty } from '@nestjs/swagger';

export class LatestResponseDto {
  @ApiProperty({
    description: 'Map of currency code to exchange rate relative to base',
    example: { USD: 1, EUR: 0.866, PKR: 280.5 },
  })
  data!: Record<string, number>;
}
