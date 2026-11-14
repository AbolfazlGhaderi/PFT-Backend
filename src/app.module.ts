import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerModule } from 'logger-nestjs';
import { ClsModule } from 'nestjs-cls';
import { DEFAULT_LOGGER_CONFIG, CLS_MODULE_CONFIG } from '@configs';
import { RequestLoggerMiddleware } from '@middlewares';

@Module({
  imports: [ClsModule.forRoot(CLS_MODULE_CONFIG), LoggerModule.register(DEFAULT_LOGGER_CONFIG)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
