import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.freecurrencyapi.com/v1';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    const key = this.config.get<string>('FREECURRENCY_API_KEY');
    if (!key) throw new Error('FREECURRENCY_API_KEY is not set in environment');
    this.apiKey = key;
  }

  async getLatest(base: string): Promise<unknown> {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.baseUrl}/latest`, {
          params: { apikey: this.apiKey, base_currency: base },
        }),
      );
      return res.data;
    } catch (err) {
      this.logger.error(`getLatest failed for base=${base}`, err);
      throw new HttpException('Failed to fetch latest exchange rates', HttpStatus.BAD_GATEWAY);
    }
  }

  async getHistorical(base: string, date: string): Promise<unknown> {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.baseUrl}/historical`, {
          params: { apikey: this.apiKey, base_currency: base, date },
        }),
      );
      return res.data;
    } catch (err) {
      this.logger.error(`getHistorical failed for base=${base} date=${date}`, err);
      throw new HttpException('Failed to fetch historical exchange rates', HttpStatus.BAD_GATEWAY);
    }
  }

  async getCurrencies(): Promise<unknown> {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.baseUrl}/currencies`, {
          params: { apikey: this.apiKey },
        }),
      );
      return res.data;
    } catch (err) {
      this.logger.error('getCurrencies failed', err);
      throw new HttpException('Failed to fetch currencies', HttpStatus.BAD_GATEWAY);
    }
  }
}
