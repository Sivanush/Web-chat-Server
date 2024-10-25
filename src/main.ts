import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CLIENT_DOMAIN') || 'http://localhost:4200';
  app.enableCors({ origin: 'http://localhost:4200' });
  app.useWebSocketAdapter(new IoAdapter(app))
  app.useGlobalPipes(new ValidationPipe()),
  app.setGlobalPrefix('api')
  await app.listen(3000);
}
bootstrap();
