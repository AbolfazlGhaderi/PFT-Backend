import { ApiErrorCodeT } from '@types';

export class ApiException {
  message: string;
  httpStatusCode?: number;
  errorCode: number;
  wsStatusCode?: number;

  constructor(errorCode: ApiErrorCodeT) {
    this.message = errorCode.message;
    this.httpStatusCode = errorCode.HttpStatusCode;
    this.errorCode = errorCode.errorCode;
    this.wsStatusCode = errorCode.wsStatusCode;
  }
}
