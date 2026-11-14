import { isEmpty } from 'class-validator';
import { LoggerService } from 'logger-nestjs';
import { ApiException } from '@exceptionsFilters';
import { API_ERROR_CODES, DEFAULT_LOGGER_CONFIG } from '@constants';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform {
  private readonly logger: LoggerService = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext(TrimStringPipe.name);

  constructor() {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    try {
      if (typeof value === 'string') {
        return value.trim();
      } else if (Array.isArray(value)) {
        return value.map(item => this.transform(item, metadata));
      } else if (typeof value === 'object' && !isEmpty(value)) {
        const transformed: Record<string, unknown> = {};
        for (const key in value) {
          transformed[key] = this.transform(Reflect.get(value, key), metadata);
        }
        return transformed;
      }
      return value;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(API_ERROR_CODES.INPUT_DATA_INCORRECT);
    }
  }
}
