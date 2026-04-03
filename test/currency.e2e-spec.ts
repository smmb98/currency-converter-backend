import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
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
          expect(res.body.data['USD']).toBeDefined();
          expect(res.body.data['EUR']).toBeDefined();
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
          expect(res.body.data['USD']).toBe(1);
          expect(typeof res.body.data['EUR']).toBe('number');
          expect(typeof res.body.data['GBP']).toBe('number');
        });
    });

    it('should return latest exchange rates for EUR', () => {
      return request(app.getHttpServer())
        .get('/currency/latest?base=EUR')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data['EUR']).toBe(1);
          expect(typeof res.body.data['USD']).toBe('number');
        });
    });

    it('should return 400 for missing base', () => {
      return request(app.getHttpServer())
        .get('/currency/latest')
        .expect(400);
    });

    it('should return 400 for invalid base length', () => {
      return request(app.getHttpServer())
        .get('/currency/latest?base=USDD')
        .expect(400);
    });
  });

  describe('/currency/historical (GET)', () => {
    it('should return historical exchange rates for a specific date', () => {
      return request(app.getHttpServer())
        .get('/currency/historical?base=USD&date=2024-01-15')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data['2024-01-15']).toBeDefined();
          expect(typeof res.body.data['2024-01-15']['EUR']).toBe('number');
          expect(typeof res.body.data['2024-01-15']['GBP']).toBe('number');
        });
    });

    it('should return 400 for invalid date format', () => {
      return request(app.getHttpServer())
        .get('/currency/historical?base=USD&date=not-a-date')
        .expect(400);
    });

    it('should return 400 for missing date', () => {
      return request(app.getHttpServer())
        .get('/currency/historical?base=USD')
        .expect(400);
    });
  });

  describe('Live Conversion', () => {
    it('should correctly convert 1 USD to EUR', async () => {
      const res = await request(app.getHttpServer())
        .get('/currency/latest?base=USD')
        .expect(200);

      const rate = res.body.data['EUR'];
      expect(rate).toBeDefined();
      expect(rate).toBeGreaterThan(0);
      expect(1 * rate).toBeGreaterThan(0.5);
    });

    it('should correctly convert 100 USD to GBP', async () => {
      const res = await request(app.getHttpServer())
        .get('/currency/latest?base=USD')
        .expect(200);

      const rate = res.body.data['GBP'];
      expect(rate).toBeDefined();
      expect(100 * rate).toBeGreaterThan(50);
    });

    it('should handle cross-currency conversion via USD base', async () => {
      const res = await request(app.getHttpServer())
        .get('/currency/latest?base=USD')
        .expect(200);

      const eurRate = res.body.data['EUR'];
      const gbpRate = res.body.data['GBP'];
      expect(eurRate / gbpRate).toBeGreaterThan(1);
    });
  });
});
