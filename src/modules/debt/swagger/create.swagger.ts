import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiCreateDebtSwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Create Debt' }),
    ApiBody({
      type: 'object',
      examples: {
        default: {
          value: {
            userId: 1,
            title: 'Bank loan',
            debtType: 3,
            totalAmount: '12000',
            initialPayment: '2000',
            installmentAmount: '500',
            totalInstallments: 24,
            installmentInterval: 5,
            description: 'Loan',
          },
        },
      },
    }),
  );
}
