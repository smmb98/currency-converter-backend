import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('CurrencyController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/currency/currencies (GET)', () => {
    it('should return list of available currencies', () => {
      return request(app.getHttpServer())
        .get('/currency/currencies')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(Object.keys(res.body.data).length).toBeGreaterThan(0);
        });
    });
  });

  describe('/currency/latest (GET)', () => {
    it('should return latest exchange rates for USD', () => {
      return request(app.getHttpServer())
        .get('/currency/latest?base=USD')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.PKR).toBeDefined();
          expect(typeof res.body.data.PKR).toBe('number');
        });
    });

    it('should return latest exchange rates for EUR', () => {
      return request(app.getHttpServer())
        .get('/currency/latest?base=EUR')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.USD).toBeDefined();
        });
    });
  });

  describe('/currency/historical (GET)', () => {
    it('should return historical exchange rates for a specific date', () => {
      return request(app.getHttpServer())
        .get('/currency/historical?base=USD&date=2024-01-01')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(typeof res.body.data.PKR).toBe('number');
        });
    });
  });

  describe('Live Conversion Test', () => {
    it('should correctly convert 1 USD to PKR', async () => {
      const latestRes = await request(app.getHttpServer())
        .get('/currency/latest?base=USD')
        .expect(200);

      const rate = latestRes.body.data.PKR;
      expect(rate).toBeDefined();
      expect(rate).toBeGreaterThan(0);

      const convertedAmount = 1 * rate;
      expect(convertedAmount).toBeGreaterThan(200);
    });

    it('should correctly convert 100 USD to EUR', async () => {
      const latestRes = await request(app.getHttpServer())
        .get('/currency/latest?base=USD')
        .expect(200);

      const rate = latestRes.body.data.EUR;
      expect(rate).toBeDefined();
      expect(rate).toBeGreaterThan(0);

      const convertedAmount = 100 * rate;
      expect(convertedAmount).toBeGreaterThan(80);
    });

    it('should handle conversion between non-USD currencies', async () => {
      const usdRates = await request(app.getHttpServer())
        .get('/currency/latest?base=USD')
        .expect(200);

      const eurToUsd = usdRates.body.data.EUR;
      const pkrToUsd = usdRates.body.data.PKR;

      const eurToPkr = pkrToUsd / eurToUsd;

      expect(eurToPkr).toBeGreaterThan(200);
    });
  });
});