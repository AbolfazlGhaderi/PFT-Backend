import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'logger-nestjs';
import { AppService } from './app.service.js';
import { DiscoveryModule } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestLoggerMiddleware } from '@middlewares';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DEFAULT_LOGGER_CONFIG, CLS_MODULE_CONFIG, THROTTLER_CONFIG } from '@configs';
import { DatabaseModule } from '@database';
import { InitializerService } from './app/plugins/initial/initializer.service.js';
import { FinancialAccountModule } from './modules/financial-account/financial-account.module.js';
import { TransactionModule } from './modules/transaction/transaction.module.js';
import { DebtModule } from './modules/debt/debt.module.js';
import { DebtPaymentModule } from './modules/debt-payment/debt-payment.module.js';
import { ConfigModule } from './modules/config/config.module.js';
import { CurrencyModule } from './modules/currency/currency.module.js';
import { CategoryModule } from './modules/category/category.module.js';

@Module({
  imports: [
    ThrottlerModule.forRoot(THROTTLER_CONFIG),
    DiscoveryModule,
    ClsModule.forRoot(CLS_MODULE_CONFIG),
    LoggerModule.register(DEFAULT_LOGGER_CONFIG),
    DatabaseModule,
    FinancialAccountModule,
    TransactionModule,
    DebtModule,
    DebtPaymentModule,
    ConfigModule,
    CurrencyModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, InitializerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
