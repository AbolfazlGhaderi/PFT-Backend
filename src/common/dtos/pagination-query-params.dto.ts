import { PaginationDto } from './pagination.dto.js';

export class PaginationQueryParamsDTO extends PaginationDto {
  where?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  fields?: string[];
}
