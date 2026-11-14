import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiCreateFinancialAccountSwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Create Financial Account' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          userId: {
            type: 'number',
            description: 'User ID',
          },
          currencyId: {
            type: 'number',
            description: 'Currency ID',
          },
          title: {
            type: 'string',
            description: 'Account title (unique per user)',
          },
          type: {
            type: 'number',
            description: '0: Bank, 1: Cash, 2: Wallet, 3: Investment',
          },
          initialBalance: {
            type: 'string',
            description: 'Initial balance (decimal as string)',
          },
          description: {
            type: 'string',
            description: 'Account description',
          },
          isActive: {
            type: 'number',
            description: '0: inactive, 1: active',
          },
        },
        required: ['userId', 'currencyId', 'title'],
      },
      examples: {
        createExample: {
          description: `
Fields that you can use:
| Field name      | Type     | Format          |
|-----------------|----------|-----------------|
| userId          | number   | REQUIRED        |
| currencyId      | number   | REQUIRED        |
| title           | string   | REQUIRED        |
| type            | number   | OPTIONAL        |
| initialBalance  | string   | OPTIONAL        |
| description     | string   | OPTIONAL        |
| isActive        | number   | OPTIONAL        |
`,
          value: {
            userId: 1,
            currencyId: 1,
            title: 'My Bank Account',
            type: 0,
            initialBalance: '1000.50',
            description: 'Account description',
            isActive: 1,
          },
        },
      },
    }),
  );
}
