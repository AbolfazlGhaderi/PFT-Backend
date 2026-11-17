import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

const statusCode = HttpStatus.OK;

export function ApiFindAllTransactionSwaggerConfig() {
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
                  total: 1,
                  page: 1,
                  limit: 15,
                  pageCount: 1,
                  hasPrevPage: false,
                  hasNextPage: false,
                  items: [
                    {
                      id: 1,
                      title: 'Grocery Shopping',
                      type: 1,
                      account: 1,
                      toAccount: null,
                      category: 5,
                      amount: '1000.50',
                      fee: '10.00',
                      discountAmount: '0.50',
                      totalAmount: '1010.00',
                      paymentMethod: 1,
                      description: 'Grocery shopping',
                      invoice: 'invoice-2026-001',
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
