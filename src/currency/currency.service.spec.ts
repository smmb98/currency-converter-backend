import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';
import axios from 'axios';

describe('CurrencyService - Live API Tests', () => {
  let service: CurrencyService;
  const API_KEY = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyService],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLatest - Live API', () => {
    it('should return latest exchange rates for USD', async () => {
      const result = await service.getLatest('USD');
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });
  });

  describe('Live Conversion Tests', () => {
    it('should convert USD to PKR with valid rate', async () => {
      const result = await service.getLatest('USD');
      const rate = result.data.PKR;
      expect(rate).toBeGreaterThan(200);
    });

    it('should convert 100 USD to ~27,000+ PKR', async () => {
      const result = await service.getLatest('USD');
      const converted = 100 * result.data.PKR;
      expect(converted).toBeGreaterThan(20000);
    });

    it('should return all major currencies', async () => {
      const result = await service.getLatest('USD');
      expect(result.data.USD).toBe(1);
      expect(result.data.EUR).toBeDefined();
      expect(result.data.GBP).toBeDefined();
    });
  });

  describe('getCurrencies - Live API', () => {
    it('should return a list of currencies', async () => {
      const result = await service.getCurrencies();
      expect(result).toBeDefined();
      expect(Object.keys(result.data).length).toBeGreaterThan(100);
    });
  });
});

describe('FreeCurrencyAPI Direct HTTP Tests', () => {
  const BASE_URL = 'https://api.freecurrencyapi.com/v1';
  const API_KEY = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2';

  it('should fetch latest USD rates via HTTP', async () => {
    const res = await axios.get(`${BASE_URL}/latest`, {
      params: { apikey: API_KEY, base_currency: 'USD' }
    });
    expect(res.data.data.PKR).toBeGreaterThan(200);
  });

  it('should convert 50 USD to EUR correctly', async () => {
    const res = await axios.get(`${BASE_URL}/latest`, {
      params: { apikey: API_KEY, base_currency: 'USD' }
    });
    const rate = res.data.data.EUR;
    const converted = 50 * rate;
    expect(converted).toBeGreaterThan(40);
  });
});