import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'logger-nestjs';
import { AppService } from './app.service.js';
import { DiscoveryModule } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestLoggerMiddleware } from '@middlewares';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DEFAULT_LOGGER_CONFIG, CLS_MODULE_CONFIG, THROTTLER_CONFIG } from '@configs';

@Module({
  imports: [ThrottlerModule.forRoot(THROTTLER_CONFIG), DiscoveryModule, ClsModule.forRoot(CLS_MODULE_CONFIG), LoggerModule.register(DEFAULT_LOGGER_CONFIG)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
