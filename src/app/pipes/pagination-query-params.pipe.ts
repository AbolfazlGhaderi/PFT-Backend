// oxlint-disable typescript/no-unsafe-assignment
import { PaginationConfig } from '@utils';
import { isArray } from 'class-validator';
import { LoggerService } from 'logger-nestjs';
import { ApiException } from '@exceptionsFilters';
import { PaginationQueryParamsDTO } from '@DTOs';
import { Injectable, PipeTransform } from '@nestjs/common';
import { DEFAULT_LOGGER_CONFIG, API_ERROR_CODES } from '@constants';

@Injectable()
export class PaginationQueryParamsPipe implements PipeTransform {
  //   transform(value: any, metadata: ArgumentMetadata): FindAllDto {
  transform(value: any): PaginationQueryParamsDTO {
    try {
      console.log(value); // TODO:
      const { where, orderBy, fields, limit, page } = value;
      //   if ((!limit || isNumberString(limit)) && (limit && isNumber(limit)))
      const { limit: limitProcessed, page: pageProcessed, skip } = PaginationConfig({ limit, page });

      // Where ----------------------------------------------------------------
      const parsedWhere = where ? (JSON.parse(where) ?? {}) : {};

      // OrderBy --------------------------------------------------------------
      const parsedOrderBy = orderBy ? (JSON.parse(orderBy) ?? {}) : {};

      // Fields ----------------------------------------------------------------
      const parsedFields = fields ? (JSON.parse(fields) ?? []) : undefined;
      if (!isArray(parsedFields)) {
        throw new Error('Fields data is incorrect');
      } else {
        if (parsedFields.length === 0) parsedFields.push('*');
      }

      // ------------------------------------------------
      return {
        where: parsedWhere,
        orderBy: parsedOrderBy,
        fields: parsedFields,
        limit: limitProcessed,
        page: pageProcessed,
        offset: skip,
      };
    } catch (error) {
      const logger = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext(PaginationQueryParamsPipe.name);
      logger.error(error);
      throw new ApiException(API_ERROR_CODES.PAGINATION_PARAM_INCORRECT);
    }
  }
}
