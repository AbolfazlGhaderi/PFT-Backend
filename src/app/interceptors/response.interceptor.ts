import { CLS_KEYS } from '@constants';
import { from, Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { isEmpty } from 'class-validator';
import { mergeMap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { paginationGenerator } from '@utils';
import { LoggerService } from 'logger-nestjs';
import { ApiResponseT, DefaultSuccessResponseT, PaginationT } from '@types';
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;

  constructor(
    private readonly clsService: ClsService,
    logger: LoggerService,
  ) {
    this.logger = logger.child(ResponseInterceptor.name);
  }

  private async decryptFields(data: unknown): Promise<unknown> {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data !== 'object') {
      return data;
    }
    if (Array.isArray(data)) {
      return Promise.all(data.map(item => this.decryptFields(item)));
    }
    const record = data as Record<string, unknown>;

    for (const [key, value] of Object.entries(record)) {
      if (typeof value === 'string' && key.endsWith('ENC')) {
        try {
          record[key] = await value.decrypt();
        } catch (error) {
          this.logger.error(`Failed to decrypt field "${key}": ${error}`);
          record[key] = value;
        }

        continue;
      } else if (Array.isArray(value)) {
        record[key] = await Promise.all(value.map(item => this.decryptFields(item)));
        continue;
      } else if (value !== null && typeof value === 'object' && value.constructor === Object) {
        record[key] = await this.decryptFields(value);
        continue;
      }

      record[key] = value;
    }

    return record;
  }

  private async processResponse(result: ApiResponseT, context: ExecutionContext, startAt: [number, number]): Promise<DefaultSuccessResponseT> {
    if (!this.clsService.isActive) {
      this.logger.error('ClsService must be active!');
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const requestId = this.clsService.get(CLS_KEYS.REQUEST_ID);
    const response = context.switchToHttp().getResponse<Response>();
    const { statusCode } = response;

    const responseObject: DefaultSuccessResponseT = {
      ok: true,
      statusCode,
      timestamp: Date.now(),
      data: {},
    };

    if (result?.type) {
      switch (result.type) {
        case 'object':
        case 'array': {
          responseObject['data'] = await this.decryptFields(result.data);
          break;
        }
        case 'pagination': {
          this.logger.verbose('get Pagination params (FindOptions) in cls');
          const paginationParams = this.clsService.get<PaginationT>(CLS_KEYS.PAGINATION_PARAMS);
          if (!paginationParams) {
            this.logger.error('When use paginationType, set PaginationParams in clsService (add clsService to finderMethod)');
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
          }
          const page = paginationParams.page;
          const limit = paginationParams.limit;
          if (isEmpty(page) || isEmpty(limit)) {
            this.logger.warn('Pagination params is incorrect, missing page or limit param');
          }
          responseObject['data'] = paginationGenerator(result.data.total, page, limit);
          responseObject['data']['items'] = await this.decryptFields(result.data.items);
          break;
        }
        case 'withoutResponse':
          break;
        default: {
          throw new Error(`Invalid response type: ${result}`);
        }
      }
    } else {
      responseObject['data'] = result;
    }

    const dif = process.hrtime(startAt);
    const responseTime = dif[0] * 1e3 + dif[1] * 1e-6;
    this.logger.log(`RequestId: ${requestId}  | path: ${context.switchToHttp().getRequest<Request>().path} | Response Time: ${responseTime.toFixed(2)}ms`);
    return responseObject;
  }

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    const startAt = process.hrtime();
    return next.handle().pipe(
      mergeMap(result => {
        this.logger.verbose(`Response before processing: ${JSON.stringify(result)}`);
        return from(this.processResponse(result as ApiResponseT, context, startAt));
      }),
    );
  }
}
