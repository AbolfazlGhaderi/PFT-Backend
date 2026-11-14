import { PaginationDto } from './pagination.dto.js';

export class FindAllDto extends PaginationDto {
  where?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  fields?: string[];
}
