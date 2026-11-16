import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiCreateDebtPaymentSwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Create Debt Payment' }),
    ApiBody({
      type: 'object',
      examples: { default: { value: { debtId: 1, transactionId: 1, installmentNumber: 1, amount: '500', description: 'First installment' } } },
    }),
  );
}
