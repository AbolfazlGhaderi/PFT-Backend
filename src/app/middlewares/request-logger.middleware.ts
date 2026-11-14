import { randomUUID } from 'node:crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from 'logger-nestjs';

import { CLS_KEYS, DEFAULT_LOGGER_CONFIG } from '@constants';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger: LoggerService = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext(RequestLoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = randomUUID();
    res.setHeader(CLS_KEYS.REQUEST_ID, requestId);
    if (req.path.startsWith('/docs')) {
      this.logger.verbose(`RequestId : ${requestId} | type: HTTP`);
      this.logger.verbose(`RequestId : ${requestId} | ip: ${req?.ip}`);
      this.logger.verbose(`RequestId : ${requestId} | method: ${req?.method}`);
      this.logger.verbose(`RequestId : ${requestId} | path: ${req?.path}`);
      next();
    }
    this.logger.verbose(`RequestId : ${requestId} | type: HTTP`);
    this.logger.verbose(`RequestId : ${requestId} | ip: ${req?.ip}`);
    this.logger.verbose(`RequestId : ${requestId} | method: ${req?.method}`);
    this.logger.verbose(`RequestId : ${requestId} | protocol: ${req?.protocol}`);
    this.logger.verbose(`RequestId : ${requestId} | hostname: ${req?.hostname}`);
    this.logger.verbose(`RequestId : ${requestId} | path: ${req?.path}`);
    this.logger.verbose(`RequestId : ${requestId} | headers: ${JSON.stringify(req?.headers)}`);
    this.logger.verbose(`RequestId : ${requestId} | cookies: ${JSON.stringify(req?.cookies)}`);
    this.logger.verbose(`RequestId : ${requestId} | params: ${JSON.stringify(req?.params)}`);
    this.logger.verbose(`RequestId : ${requestId} | query: ${JSON.stringify(req?.query)}`);
    this.logger.verbose(`RequestId : ${requestId} | body: ${JSON.stringify(req?.body)}`);
    this.logger.verbose(`RequestId : ${requestId} | secure: ${req?.secure}`);
    this.logger.verbose(`RequestId : ${requestId} | originalUrl: ${req?.originalUrl}`);
    this.logger.verbose(`RequestId : ${requestId} | baseUrl: ${req?.baseUrl}`);
    this.logger.verbose(`RequestId : ${requestId} | subdomains: ${JSON.stringify(req?.subdomains)}`);

    next();
  }
}
