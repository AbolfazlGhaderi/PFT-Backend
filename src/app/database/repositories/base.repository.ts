import { ClsService } from 'nestjs-cls';
import { LoggerService } from 'logger-nestjs';
import { PaginationQueryParamT } from '@types';
import { DEFAULT_LOGGER_CONFIG } from '@configs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CLS_KEYS, FILTER_DELETED_TITLE } from '@constants';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository<Entity extends object> extends EntityRepository<Entity> {
  logger = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext(BaseRepository.name);

  async advanceFinder(query: PaginationQueryParamT<Entity>, clsService?: ClsService): Promise<[Entity[], number]> {
    this.logger.verbose(`Input FindOptions: ${JSON.stringify(query ?? {})}`);

    const metadata = this.em.getMetadata().get(this.entityName);
    const entityColumns = Object.keys(metadata.properties);

    if (query.fields && query.fields.length > 0) {
      const invalidFields = query.fields.filter(field => (field === '*' ? false : !entityColumns.includes(field.includes('.') ? field.split('.')[0] : field)));
      if (invalidFields.length > 0) {
        this.logger.error(`Invalid fields: ${invalidFields.join(', ')}. Valid fields: ${entityColumns.join(', ')}`);
        throw new HttpException(`Selected invalid fields: ${invalidFields.join(', ')}`, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    query.where = query.where || {};
    let filters = {};
    if (entityColumns.includes('deletedAt')) {
      const { has, value: _ } = this.hasDeletedAt_UTC(query.where);
      filters = has ? { [FILTER_DELETED_TITLE]: false } : {};
    }

    this.logger.verbose(`Final FindOptions: ${JSON.stringify({ ...query, filters })}`);

    // CLSService  -----------------------------
    if (clsService && clsService.isActive()) {
      this.logger.verbose('Set Pagination params (FindOptions) in cls');
      clsService.set(CLS_KEYS.PAGINATION_PARAMS, { ...query, filters });
    }

    // Find One -----------------------------------------
    if (Reflect.has(query.where || {}, 'id') && typeof Reflect.get(query?.where, 'id') !== 'object') {
      const result = await this.findOne(query.where, {
        // @ts-expect-error
        fields: query.fields,
        filters,
      });

      if (!result) return [[], 0];
      // @ts-expect-error
      return [result, 1];
    }

    // FIndAll -----------------------------------------------------------
    // @ts-expect-error
    return await this.findAndCount(query.where, {
      orderBy: query.orderBy,
      // @ts-expect-error
      fields: query.fields,
      limit: query.limit,
      offset: query.offset,
      filters,
    });
  }

  hasDeletedAt_UTC(obj: unknown): { has: boolean; value: unknown } {
    if (!obj || typeof obj !== 'object') return { has: false, value: 0 };

    for (const [key, value] of Object.entries(obj)) {
      if (key === 'deletedAt') {
        return { has: true, value: value };
      }
      if (typeof value === 'object') {
        return this.hasDeletedAt_UTC(value);
      }
    }
    return { has: false, value: 0 };
  }
}
