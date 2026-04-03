import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
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

  it('/currency/currencies (GET) returns 200', () => {
    return request(app.getHttpServer())
      .get('/currency/currencies')
      .expect(200);
  });

  it('/currency/latest (GET) without base returns 400', () => {
    return request(app.getHttpServer())
      .get('/currency/latest')
      .expect(400);
  });

  it('/currency/historical (GET) with invalid date returns 400', () => {
    return request(app.getHttpServer())
      .get('/currency/historical?base=USD&date=not-a-date')
      .expect(400);
  });
});
