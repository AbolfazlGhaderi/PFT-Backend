import { FilterQuery, OrderDefinition } from '@mikro-orm/postgresql';

export interface PaginationINF {
  page?: number;
  limit?: number;
  offset?: number;
}
export interface PaginationQueryParamINF<Entity> extends PaginationINF {
  where?: FilterQuery<Entity>;
  orderBy?: OrderDefinition<Entity>;
  fields?: string[];
}
