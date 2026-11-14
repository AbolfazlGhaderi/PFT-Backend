import { Module } from '@nestjs/common';

import { FinancialAccountController } from './financial-account.controller.js';
import { FinancialAccountService } from './financial-account.service.js';

// repositories come from the global DatabaseModule, no forFeature needed
@Module({
  controllers: [FinancialAccountController],
  providers: [FinancialAccountService],
  exports: [FinancialAccountService],
})
export class FinancialAccountModule {}
