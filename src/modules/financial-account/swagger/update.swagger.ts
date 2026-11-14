import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiUpdateFinancialAccountSwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Update Financial Account' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Financial account ID',
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
        required: ['id'],
      },
      examples: {
        updateExample: {
          description: `
Fields that you can use:
| Field name      | Type     | Format          |
|-----------------|----------|-----------------|
| id              | number   | REQUIRED        |
| currencyId      | number   | OPTIONAL        |
| title           | string   | OPTIONAL        |
| type            | number   | OPTIONAL        |
| initialBalance  | string   | OPTIONAL        |
| description     | string   | OPTIONAL        |
| isActive        | number   | OPTIONAL        |
`,
          value: {
            id: 1,
            description: 'Updated account description',
            isActive: 0,
          },
        },
      },
    }),
  );
}
