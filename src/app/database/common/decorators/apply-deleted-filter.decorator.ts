import { applyDecorators } from '@nestjs/common';

import { FILTER_DELETED_TITLE } from '@constants';
import { Filter } from '@mikro-orm/decorators/legacy';

export function ApplyDeletedFilter() {
  // cond must match live rows (isDeleted = 0); `$ne: 0` selected deleted rows instead
  return applyDecorators(Filter({ name: FILTER_DELETED_TITLE, cond: { isDeleted: 0 }, default: true }));
}
