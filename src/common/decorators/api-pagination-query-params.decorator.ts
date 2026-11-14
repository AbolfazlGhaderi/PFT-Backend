import { applyDecorators, UsePipes } from '@nestjs/common';

import { PaginationQueryParamsPipe } from '@pipes';

export function ApiPaginationQueryParams() {
  return applyDecorators(UsePipes(new PaginationQueryParamsPipe()));
}
