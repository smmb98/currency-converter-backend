import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Currency Converter API')
    .setDescription('API for currency conversion')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  const url = await app.getUrl();
  console.log(`
  Application running at: ${url}
  Swagger UI: ${url}/api
  Swagger JSON: ${url}/api-json
  `);
}
bootstrap();