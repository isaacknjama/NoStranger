import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable validation pipes for all endpoints
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Transform payloads to DTOs
    whitelist: true, // Strip properties not in DTO
  }));
  
  // Enable CORS for frontend applications
  app.enableCors();
  
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();