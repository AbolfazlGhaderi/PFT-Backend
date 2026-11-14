import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module.js';
import { EnvLoaderService } from '@plugins';
import { LoggerService } from 'logger-nestjs';
import { DEFAULT_LOGGER_CONFIG } from '@configs';
import { InitializerService } from './initializer.service.js';

async function bootstrap() {
  const logger = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext('Bootstrap-Initializer');

  // Load ENVs
  EnvLoaderService.load();

  logger.log('Start app');
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  logger.log('App started');

  // appInitializer(app)
  logger.log('Start initializer');
  await app.get(InitializerService).start();
  logger.log('End initializer');

  await app.close();
  process.exit(0);
}

void bootstrap();
