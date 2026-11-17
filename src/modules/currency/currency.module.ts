import { Module } from '@nestjs/common';

import { CurrencyController } from './currency.controller.js';
import { CurrencyService } from './currency.service.js';

// repositories come from the global DatabaseModule, no forFeature needed
@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
