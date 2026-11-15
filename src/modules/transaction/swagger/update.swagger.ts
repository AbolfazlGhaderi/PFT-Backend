import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiUpdateTransactionSwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Update Transaction' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Transaction ID',
          },
          type: {
            type: 'number',
            description: '1: Expense, 2: Income, 3: Transfer',
          },
          accountId: {
            type: 'number',
            description: 'Source financial account ID',
          },
          toAccountId: {
            type: 'number',
            description: 'Destination account ID (TRANSFER only; omit for external transfers, must differ from accountId when given)',
          },
          categoryId: {
            type: 'number',
            description: 'Category ID',
          },
          amount: {
            type: 'string',
            description: 'Amount (decimal as string, > 0)',
          },
          fee: {
            type: 'string',
            description: 'Fee (decimal as string, >= 0)',
          },
          discountAmount: {
            type: 'string',
            description: 'Discount amount (decimal as string, >= 0)',
          },
          paymentMethod: {
            type: 'number',
            description:
              '0: Cash, 1: Card, 2: OnlinePayment, 3: CardToCard, 4: Bridge, 5: Paya, 6: Satna, 7: InBank, 8: BankTransfer, 9: Wallet, 10: BlueToBlue',
          },
          description: {
            type: 'string',
            description: 'Description',
          },
          invoice: {
            type: 'string',
            description: 'Invoice reference (max 300 chars)',
          },
        },
        required: ['id'],
      },
      examples: {
        updateExample: {
          description: `
The previous balance effect is reverted and the new one applied atomically (single DB transaction).

Fields that you can use:
| Field name      | Type     | Format          |
|-----------------|----------|-----------------|
| id              | number   | REQUIRED        |
| type            | number   | OPTIONAL        |
| accountId       | number   | OPTIONAL        |
| toAccountId     | number   | OPTIONAL        |
| categoryId      | number   | OPTIONAL        |
| amount          | string   | OPTIONAL        |
| fee             | string   | OPTIONAL        |
| discountAmount  | string   | OPTIONAL        |
| paymentMethod   | number   | OPTIONAL        |
| description     | string   | OPTIONAL        |
| invoice         | string   | OPTIONAL        |
`,
          value: {
            id: 1,
            amount: '1500.00',
            description: 'Updated description',
          },
        },
      },
    }),
  );
}
