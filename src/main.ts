import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { EnvLoaderService } from '@plugins';
import { LoggerService } from 'logger-nestjs';
import { DEFAULT_LOGGER_CONFIG } from '@configs';
import { EnvKeys } from '@enums';

async function bootstrap() {
  const logger = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext('BOOTSTRAP');
  // Load ENVs
  EnvLoaderService.load();

  const app = await NestFactory.create(AppModule, { logger });
  app.enableCors({
    origin: EnvLoaderService.get(EnvKeys.CORS_ORIGINS) ?? '*',
    methods: EnvLoaderService.get(EnvKeys.CORS_METHODS) ?? 'GET',
    credentials: true,
    // allowedHeaders: 'Content-Type, Authorization, X-Device-Id',
  });

  // App Listen
  const PORT = EnvLoaderService.get(EnvKeys.APP_PORT) ?? 3000;
  const HOST = EnvLoaderService.get(EnvKeys.APP_HOST) ?? 'localhost';
  await app.listen(PORT, HOST, () => {
    // logs
    logger.verbose(`App :  http://${HOST}:${PORT}`);
    if (EnvLoaderService.get(EnvKeys.NODE_ENV, 'development') === 'development') {
      logger.verbose(`Swagger :  http://${HOST}:${PORT}/${EnvLoaderService.getOrFail(EnvKeys.SWAGGER_PATH)}`);
      logger.verbose(`Scalar :  http://${HOST}:${PORT}${EnvLoaderService.getOrFail(EnvKeys.SCALAR_PATH)}`);
    }
  });
}
await bootstrap();
