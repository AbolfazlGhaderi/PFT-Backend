import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { EnvLoaderService } from '@plugins';
import { LoggerService } from 'logger-nestjs';
import { DEFAULT_LOGGER_CONFIG, openApiConfig } from '@configs';
import { EnvKeys } from '@enums';
import helmet from 'helmet';
import { ClsService } from 'nestjs-cls';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from '@interceptors';
import { HttpExceptionFilter } from '@exceptionsFilters';
import { TrimStringPipe } from '@pipes';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExpressRouteLayer } from '@types'

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

  const clsService = app.get(ClsService);
  const loggerService = app.get(LoggerService);

  // initialize app
  app.useGlobalInterceptors(new ResponseInterceptor(clsService, loggerService));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(clsService, loggerService));
  app.setGlobalPrefix('api');
  app.use(cookieParser(EnvLoaderService.getOrFail('COOKIE_SECRET')));
  app.useGlobalPipes(new TrimStringPipe());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.getHttpAdapter().all('/', (_: Request, response: Response) => response.send());
  app.getHttpAdapter().all('/api', (_: Request, response: Response) => response.send());
  app.getHttpAdapter().get('/apis', (_: Request, response: Response) => {
    const authHeader = _.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      response.setHeader('WWW-Authenticate', 'Basic realm="Restricted"');
      return response.status(401).send('Authentication required.');
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== 'admin' || password !== '1234') {
      response.setHeader('WWW-Authenticate', 'Basic realm="Restricted"');
      return response.status(401).send('Invalid credentials.');
    }

    const server = app.getHttpServer();
    const router = server._events.request.router;
    const routes = (router.stack as ExpressRouteLayer[])
    .filter(layer => layer.route?.path.startsWith('/api/'))
    .map(layer => layer.route?.path)
    response.json(routes);
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  openApiConfig(app);

  // App Listen
  const PORT = EnvLoaderService.get(EnvKeys.APP_PORT, 3000);
  const HOST = EnvLoaderService.get(EnvKeys.APP_HOST, '0.0.0.0');
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
