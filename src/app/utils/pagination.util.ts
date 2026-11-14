import { PaginationDto } from '@DTOs';
import { isEmpty, isNumberString } from 'class-validator';

export function PaginationConfig(paginationData: PaginationDto) {
  const { limit, page } = paginationData;

  if (!isEmpty(page) && isNaN(Number(page))) throw new Error('Page must be number or numberString');
  if (!isEmpty(limit) && isNaN(Number(limit))) throw new Error('limit must be number or numberString');
  let pageN = isNumberString(page) ? Number(page) : 0;
  let limitN = isNumberString(limit) ? Number(limit) : 5;

  // let pageN = Number.parseInt(page)
  // let limitN = Number.parseInt(limit)

  if (pageN <= 1) pageN = 1;

  if (!limitN || limitN <= 0) limitN = 5;

  const skip = (pageN - 1) * limitN;

  return {
    page: pageN,
    limit: limitN,
    skip: skip,
  };
}

export function paginationGenerator(count: number = 0, page: number = 0, limit: number = 0) {
  const pageCount = Math.ceil(count / limit);
  const total = +count;
  const hasPrevPage = page > 1;
  const hasNextPage = page < pageCount;
  return {
    total,
    page: +page,
    limit: +limit,
    pageCount,
    hasPrevPage,
    hasNextPage,
  };
}

export function paginationSolver(page: number = 1, limit: number = 5) {
  if (!page || page <= 1) page = 0;
  else page = page - 1;

  if (!limit || limit <= 5) limit = 5;

  const skip = page * limit;
  return { page: page + 1, skip, limit };
}
