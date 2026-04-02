import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get latest exchange rates' })
  @ApiQuery({
    name: 'base',
    required: true,
    description: 'Base currency code (e.g., USD)',
  })
  getLatest(@Query('base') base: string) {
    return this.service.getLatest(base);
  }

  @Get('historical')
  @ApiOperation({ summary: 'Get historical exchange rates' })
  @ApiQuery({ name: 'base', required: true, description: 'Base currency code' })
  @ApiQuery({ name: 'date', required: true, description: 'Date (YYYY-MM-DD)' })
  getHistorical(@Query('base') base: string, @Query('date') date: string) {
    return this.service.getHistorical(base, date);
  }

  @Get('currencies')
  @ApiOperation({ summary: 'Get available currencies' })
  getCurrencies() {
    return this.service.getCurrencies();
  }
}
