import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { LatestDto } from './dto/latest.dto/latest.dto';
import { HistoricalDto } from './dto/historical.dto/historical.dto';
import { CurrenciesDto } from './dto/currencies.dto/currencies.dto';

@ApiTags('currency')
@Controller('currency')
@UsePipes(new ValidationPipe({ transform: true }))
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get latest exchange rates' })
  getLatest(@Query() dto: LatestDto) {
    return this.service.getLatest(dto.base);
  }

  @Get('historical')
  @ApiOperation({ summary: 'Get historical exchange rates' })
  getHistorical(@Query() dto: HistoricalDto) {
    return this.service.getHistorical(dto.base, dto.date);
  }

  @Get('currencies')
  @ApiOperation({ summary: 'Get available currencies' })
  getCurrencies(@Query() dto: CurrenciesDto) {
    return this.service.getCurrencies();
  }
}