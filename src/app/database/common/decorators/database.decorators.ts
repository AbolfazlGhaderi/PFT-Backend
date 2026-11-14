import { applyDecorators } from '@nestjs/common';

import { FILTER_DELETED_TITLE } from '@constants';
import { Filter, PrimaryKey } from '@mikro-orm/decorators/legacy';
import { IdT } from '../types/id.type.js';

export function ApplyDeletedFilter() {
  // cond must match live rows (deletedAt IS NULL); `$ne: null` selected deleted rows instead
  return applyDecorators(Filter({ name: FILTER_DELETED_TITLE, cond: { deletedAt: null }, default: true }));
}

export function PrimaryColumn(columnName: string = 'Id') {
  return PrimaryKey({ autoincrement: true, name: columnName, type: IdT, unsigned: true });
}
