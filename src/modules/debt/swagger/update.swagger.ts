import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiUpdateDebtSwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Update Debt' }),
    ApiBody({ type: 'object', examples: { default: { value: { id: 1, status: 2 } } } }),
  );
}
