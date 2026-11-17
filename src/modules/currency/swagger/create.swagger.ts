import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { API_TAG } from './constant.js';

export function ApiCreateCurrencySwaggerConfig() {
  return applyDecorators(
    ApiTags(API_TAG),
    ApiBearerAuth('Authorization'),
    ApiOperation({ summary: 'Create Currency' }),
    ApiBody({
      type: 'object',
      examples: { default: { value: { code: 'EUR', title: 'Euro', symbol: '€', decimalPlaces: '2', description: 'Euro currency' } } },
    }),
  );
}
