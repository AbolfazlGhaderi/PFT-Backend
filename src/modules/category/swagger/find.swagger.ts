import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiFindAllCategorySwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Find Categories' }),
    ApiQuery({ name: 'queries', required: false, type: 'object', examples: { simpleRequest: { value: { page: 1, limit: 15, fields: ['*'], orderBy: { id: 'DESC' }, where: {} } } } }),
  );
}
