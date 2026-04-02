import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  private readonly API_KEY = 'YOUR_API_KEY';
  private readonly BASE_URL = 'https://api.freecurrencyapi.com/v1';

  constructor(private readonly http: HttpService) {}

  async getLatest(base: string) {
    const url = `${this.BASE_URL}/latest?apikey=${this.API_KEY}&base_currency=${base}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }

  async getHistorical(base: string, date: string) {
    const url = `${this.BASE_URL}/historical?apikey=${this.API_KEY}&base_currency=${base}&date=${date}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }

  async getCurrencies() {
    const url = `${this.BASE_URL}/currencies?apikey=${this.API_KEY}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }
}