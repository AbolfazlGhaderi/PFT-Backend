import { EnvKeys } from '@enums';
import type { FilterQuery, OrderDefinition } from '@mikro-orm/postgresql';


export type ExpressRouteLayer = {
    route?: {
        path: string
    }
}

// ------
export type ENVKeyT = {
  [K in keyof typeof EnvKeys]: string;
};

// Response types -------------------------------------------------
export type ResponseT = 'object' | 'array' | 'pagination';
export type PaginationResponseT = {
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
export type ObjectResponseT = {
  type: 'object';
  data: unknown;
};
export type ArrayResponseT = {
  type: 'array';
  data: Array<unknown>;
};
export type WithoutResponseT = {
  type: 'withoutResponse';
  data?: Array<unknown>;
};

export type ApiResponseT = PaginationResponseT | ObjectResponseT | ArrayResponseT | WithoutResponseT;
export type DefaultSuccessResponseT = {
  ok: boolean;
  statusCode: number;
  timestamp: number;
  data: any;
};

// Pagination ------------- ----------

export type PaginationT = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type PaginationQueryParamT<Entity> = PaginationT & {
  where?: FilterQuery<Entity>;
  orderBy?: OrderDefinition<Entity>;
  fields?: string[];
};

// Error codes -------------------------------------------------
export type ApiErrorCodeT = {
  message: string;
  HttpStatusCode: number;
  errorCode: number;
  wsStatusCode?: number;
};
export type ApiErrorCodes = Record<string, ApiErrorCodeT>;

// Token types -------------------------------------------------
type TokenT = 'Bearer';

export type GenerateTokenT = {
  tokenType: TokenT;
  token: string;
  expiryMs: number;
  expiresIn: number;
};

export type RefreshTokenPayloadT = {
  // UserId
  sub: string;
  // UserSession GUID
  jti: string;
};
export type AccessTokenPayloadT = {
  // UserId
  sub: string;
};
