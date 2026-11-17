import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiCreateConfigSwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Create Config' }),
    ApiBody({ type: 'object', examples: { default: { value: { key: 'APP_NAME', value: 'MyApp', type: 1, description: 'Application name' } } } }),
  );
}
