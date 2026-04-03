import { HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { CurrencyService } from './currency.service';

const mockHttpService = {
  get: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test-key'),
};

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .setLogger({ log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn(), verbose: jest.fn() })
      .compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLatest', () => {
    it('returns data from API', async () => {
      mockHttpService.get.mockReturnValue(of({ data: { data: { PKR: 280 } } }));
      const result = await service.getLatest('USD');
      expect(result).toEqual({ data: { PKR: 280 } });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/latest'),
        expect.objectContaining({ params: expect.objectContaining({ base_currency: 'USD' }) }),
      );
    });

    it('throws HttpException on API failure', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('network error')));
      await expect(service.getLatest('USD')).rejects.toThrow(HttpException);
    });
  });

  describe('getHistorical', () => {
    it('returns historical data from API', async () => {
      mockHttpService.get.mockReturnValue(of({ data: { data: { PKR: 275 } } }));
      const result = await service.getHistorical('USD', '2024-01-01');
      expect(result).toEqual({ data: { PKR: 275 } });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/historical'),
        expect.objectContaining({ params: expect.objectContaining({ date: '2024-01-01' }) }),
      );
    });

    it('throws HttpException on API failure', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('network error')));
      await expect(service.getHistorical('USD', '2024-01-01')).rejects.toThrow(HttpException);
    });
  });

  describe('getCurrencies', () => {
    it('returns currencies from API', async () => {
      mockHttpService.get.mockReturnValue(of({ data: { data: { USD: {}, EUR: {} } } }));
      const result = await service.getCurrencies();
      expect(result).toEqual({ data: { USD: {}, EUR: {} } });
    });

    it('throws HttpException on API failure', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('network error')));
      await expect(service.getCurrencies()).rejects.toThrow(HttpException);
    });
  });
});
