import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

const mockService = {
  getLatest: jest.fn().mockResolvedValue({ data: {} }),
  getHistorical: jest.fn().mockResolvedValue({ data: {} }),
  getCurrencies: jest.fn().mockResolvedValue({ data: {} }),
};

describe('CurrencyController', () => {
  let controller: CurrencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [{ provide: CurrencyService, useValue: mockService }],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getLatest delegates to service', async () => {
    await controller.getLatest({ base: 'USD' } as any);
    expect(mockService.getLatest).toHaveBeenCalledWith('USD');
  });

  it('getHistorical delegates to service', async () => {
    await controller.getHistorical({ base: 'USD', date: '2024-01-01' } as any);
    expect(mockService.getHistorical).toHaveBeenCalledWith('USD', '2024-01-01');
  });

  it('getCurrencies delegates to service', async () => {
    await controller.getCurrencies();
    expect(mockService.getCurrencies).toHaveBeenCalled();
  });
});
