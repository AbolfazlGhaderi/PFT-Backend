import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiCreateCategorySwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Create Category' }),
    ApiBody({ type: 'object', examples: { default: { value: { key: 'GROCERIES', value: 'خواربار', type: 2, parentId: 1, description: 'Food shopping' } } } }),
  );
}
