import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

const statusCode = HttpStatus.OK;

export function ApiFindAllFinancialAccountSwaggerConfig() {
  return applyDecorators(
    ApiBearerAuth('Authorization'),
    ApiTags(API_TAG),
    ApiQuery({
      name: 'queries',
      required: false,
      type: 'object',
      examples: {
        simpleRequest: {
          summary: 'Simple request',
          value: {
            page: 1,
            limit: 15,
            fields: ['*'],
            orderBy: { id: 'DESC' },
            where: {},
          },
        },
      },
    }),
    ApiResponse({
      status: statusCode,
      description: 'Request submitted successfully',
      content: {
        'application/json': {
          examples: {
            simpleResponse: {
              summary: 'Simple pagination response',
              description: 'Simple pagination response',
              value: {
                ok: true,
                statusCode,
                timestamp: 1750000000000,
                data: {
                  total: 2,
                  page: 1,
                  limit: 15,
                  pageCount: 1,
                  hasPrevPage: false,
                  hasNextPage: false,
                  items: [
                    {
                      id: 1,
                      userId: 1,
                      currencyId: 1,
                      title: 'My Bank Account',
                      type: 0,
                      initialBalance: '1000.50',
                      currentBalance: '1000.50',
                      description: 'Account description',
                      isActive: 1,
                      createdAt: '2026-06-16T08:00:00.000Z',
                      createdBy: null,
                      modifiedAt: '2026-06-16T08:00:00.000Z',
                      modifiedBy: null,
                      isDeleted: null,
                    },
                    {
                      id: 2,
                      userId: 1,
                      currencyId: 2,
                      title: 'My Wallet',
                      type: 2,
                      initialBalance: '0',
                      currentBalance: '0',
                      description: 'Another account description',
                      isActive: 1,
                      createdAt: '2026-06-16T08:00:00.000Z',
                      createdBy: null,
                      modifiedAt: '2026-06-16T08:00:00.000Z',
                      modifiedBy: null,
                      isDeleted: null,
                    },
                  ],
                },
              },
            },
          },
        },
      },
    }),
  );
}
