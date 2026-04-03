import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://shimmering-sopapillas-79b0b5.netlify.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application running on: ${await app.getUrl()}`);
}

bootstrap();
