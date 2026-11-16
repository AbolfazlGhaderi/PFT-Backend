import { Module } from '@nestjs/common';

import { DebtPaymentController } from './debt-payment.controller.js';
import { DebtPaymentService } from './debt-payment.service.js';

// repositories come from the global DatabaseModule, no forFeature needed
@Module({
  controllers: [DebtPaymentController],
  providers: [DebtPaymentService],
  exports: [DebtPaymentService],
})
export class DebtPaymentModule {}
