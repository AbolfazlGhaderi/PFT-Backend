import { EnvKeys } from './enums/env-keys.enum.js';

export type ENVType = {
  [K in keyof typeof EnvKeys]: string;
};

// Response types -------------------------------------------------
export type ResponseTypes = 'object' | 'array' | 'pagination';
export type PaginationResponseType = {
  type: 'pagination';
  data: {
    total: number;
    page?: number;
    limit?: number;
    pageCount?: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    items: Array<unknown>;
  };
};
export type ObjectResponseType = {
  type: 'object';
  data: unknown;
};
export type ArrayResponseType = {
  type: 'array';
  data: Array<unknown>;
};
export type WithoutResponseType = {
  type: 'withoutResponse';
  data?: Array<unknown>;
};

export type ApiResponse = PaginationResponseType | ObjectResponseType | ArrayResponseType | WithoutResponseType;
export type DefaultSuccessResponseT = {
  ok: boolean;
  statusCode: number;
  timestamp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};
// ----------------------------------------

export type ApiErrorCodeTYP = {
  message: string;
  HttpStatusCode: number;
  errorCode: number;
  wsStatusCode?: number;
};
export type ApiErrorCodes = Record<string, ApiErrorCodeTYP>;

export type GenerateTokenTYP = {
  tokenType: 'Bearer';
  token: string;
  expiryMs: number;
  expiresIn: number;
};

export type RefreshTokenPayloadTYP = {
  // UserId
  sub: string;
  // UserSession GUID
  jti: string;
};
export type AccessTokenPayloadTYP = {
  // UserId
  sub: string;
};
