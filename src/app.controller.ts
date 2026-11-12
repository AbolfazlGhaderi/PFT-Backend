import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { LoggerService } from 'logger-nestjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {
    this.logger = logger.child(AppController.name);
  }

  @Get()
  getHello(): string {
    this.logger.info('Handling getHello request');
    return this.appService.getHello();
  }
}
