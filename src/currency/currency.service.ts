import { Injectable, OnModuleInit } from '@nestjs/common';
import FreeCurrencyAPI from '@everapi/freecurrencyapi-js';

@Injectable()
export class CurrencyService implements OnModuleInit {
  private readonly API_KEY = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2';
  private client: FreeCurrencyAPI;

  onModuleInit() {
    this.client = new FreeCurrencyAPI(this.API_KEY);
  }

  async getLatest(base: string) {
    return this.client.latest({ base_currency: base });
  }

  async getHistorical(base: string, date: string) {
    return this.client.historical({ base_currency: base, date });
  }

  async getCurrencies() {
    return this.client.currencies();
  }
}