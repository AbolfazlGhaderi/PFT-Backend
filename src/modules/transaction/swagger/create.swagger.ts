import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiCreateTransactionSwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Create Transaction' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          userId: {
            type: 'number',
            description: 'User ID',
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
        required: ['userId', 'type', 'accountId', 'amount'],
      },
      examples: {
        createExample: {
          description: `
Rules:
| Rule                              | Description                                                    |
|-----------------------------------|----------------------------------------------------------------|
| TotalAmount                       | computed server-side: Amount + Fee - DiscountAmount            |
| Expense                           | TotalAmount is deducted from the account currentBalance        |
| Income                            | TotalAmount is added to the account currentBalance             |
| Transfer                          | TotalAmount deducted from account, Amount added to toAccount   |
| toAccountId                       | optional for TRANSFER (omit for external transfers); forbidden otherwise; must differ from accountId |
| currencies                        | both accounts of an internal TRANSFER must share the same currency |
| atomicity                         | insert + balance updates run in a single DB transaction        |
`,
          value: {
            userId: 1,
            type: 1,
            accountId: 1,
            categoryId: 1,
            amount: '1000.50',
            fee: '10',
            discountAmount: '0.50',
            paymentMethod: 1,
            description: 'Grocery shopping',
            invoice: 'invoice-2026-001',
          },
        },
      },
    }),
  );
}
