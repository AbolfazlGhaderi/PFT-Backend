import { Response } from 'express';
import { ApiException } from './api-exception.js';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

const DEFAULT_STATUS_CODE = 5000;

@Catch(HttpException, ApiException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | ApiException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>(); // Response

    let status: number;
    let errorCode = 1000;
    let message: string | string[] | object = 'Internal Server Error';
    if (exception instanceof ApiException) {
      const responseData = exception;
      message = responseData.message;
      status = responseData.httpStatusCode ?? DEFAULT_STATUS_CODE;
      errorCode = responseData.errorCode;
    } else {
      const responseData = exception.getResponse();
      status = exception.getStatus();
      if (typeof responseData === 'object' && Reflect.has(responseData, 'message')) {
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        message = Reflect.get(responseData, 'message');
      } else if (typeof responseData === 'string') {
        message = responseData;
      } else {
        message = 'something wrong';
      }
    }

    response.status(status).json({
      ok: false,
      statusCode: status,
      timestamp: Date.now(),
      errorCode,
      data: {
        message,
      },
    });
  }
}
