import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8080;

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Scheduler API')
    .setDescription('API documentation for Scheduler backend')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT);

  const url = `http://localhost:${PORT}`;

  Logger.log(`🚀 Server active at ${url}`, 'Bootstrap');
  Logger.log(`📘 Swagger active at ${url}/swagger`, 'Bootstrap');

  console.log(`🚀 Server active at http://localhost:${PORT}`);
}
bootstrap();
