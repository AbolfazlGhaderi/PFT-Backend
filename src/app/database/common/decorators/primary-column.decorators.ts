import { IdT } from '../types/id.type.js';
import { PrimaryKey } from '@mikro-orm/decorators/legacy';

export function PrimaryColumn(columnName: string = 'Id') {
  return PrimaryKey({ autoincrement: true, name: columnName, type: IdT, unsigned: true });
}
