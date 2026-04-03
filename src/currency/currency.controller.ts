import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrenciesResponseDto } from './dto/currencies-response.dto';
import { HistoricalResponseDto } from './dto/historical-response.dto';
import { HistoricalDto } from './dto/historical.dto/historical.dto';
import { LatestDto } from './dto/latest.dto/latest.dto';
import { LatestResponseDto } from './dto/latest-response.dto';
import { CurrencyService } from './currency.service';

@ApiTags('currency')
@Controller('currency')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get latest exchange rates for a base currency' })
  @ApiResponse({ status: 200, type: LatestResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or missing base currency code' })
  @ApiResponse({ status: 502, description: 'FreeCurrencyAPI upstream error' })
  getLatest(@Query() dto: LatestDto): Promise<unknown> {
    return this.service.getLatest(dto.base);
  }

  @Get('historical')
  @ApiOperation({ summary: 'Get historical exchange rates for a base currency on a given date' })
  @ApiResponse({ status: 200, type: HistoricalResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid base currency code or date format' })
  @ApiResponse({ status: 502, description: 'FreeCurrencyAPI upstream error' })
  getHistorical(@Query() dto: HistoricalDto): Promise<unknown> {
    return this.service.getHistorical(dto.base, dto.date);
  }

  @Get('currencies')
  @ApiOperation({ summary: 'Get metadata for all supported currencies' })
  @ApiResponse({ status: 200, type: CurrenciesResponseDto })
  @ApiResponse({ status: 502, description: 'FreeCurrencyAPI upstream error' })
  getCurrencies(): Promise<unknown> {
    return this.service.getCurrencies();
  }
}
