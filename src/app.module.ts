import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerModule } from 'logger-nestjs';
import { DEFAULT_LOGGER_CONFIG } from '@configs';

@Module({
  imports: [LoggerModule.register(DEFAULT_LOGGER_CONFIG)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
