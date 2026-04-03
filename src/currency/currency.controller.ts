import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { HistoricalDto } from './dto/historical.dto/historical.dto';
import { LatestDto } from './dto/latest.dto/latest.dto';
import { CurrencyService } from './currency.service';

@Controller('currency')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Get('latest')
  getLatest(@Query() dto: LatestDto): Promise<unknown> {
    return this.service.getLatest(dto.base);
  }

  @Get('historical')
  getHistorical(@Query() dto: HistoricalDto): Promise<unknown> {
    return this.service.getHistorical(dto.base, dto.date);
  }

  @Get('currencies')
  getCurrencies(): Promise<unknown> {
    return this.service.getCurrencies();
  }
}
