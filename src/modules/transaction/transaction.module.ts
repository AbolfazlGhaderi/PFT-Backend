import { Module } from '@nestjs/common';

import { TransactionController } from './transaction.controller.js';
import { TransactionService } from './transaction.service.js';

// repositories come from the global DatabaseModule, no forFeature needed
@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
