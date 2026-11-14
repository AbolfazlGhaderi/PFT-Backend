import { applyDecorators } from '@nestjs/common';

import { FILTER_DELETED_TITLE } from '@constants';
import { Filter, PrimaryKey } from '@mikro-orm/decorators/legacy';

export function ApplyDeletedFilter() {
  return applyDecorators(Filter({ name: FILTER_DELETED_TITLE, cond: { deletedAt: { $ne: null } }, default: true }));
}

export function PrimaryColumn(colunName: string = 'Id') {
  return PrimaryKey({ autoincrement: true, name: colunName, type: 'bigint', unsigned: true });
}
