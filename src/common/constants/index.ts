import { LoggerConfig } from 'logger-nestjs';

export * from './errors.constant.js';
export * from './databse.constant.js';
// -------------------
export const DEFAULT_DB_PORT = 3306;
export const ENCRYPTION_PREFIX = 'enc';

// DB

export const FILTER_DELETED_TITLE = 'notDeleted';

// CLS
export const CLS_LOG_CYCLE = 'CLS_LOG_CYCLE';
export const CLS_KEYS = {
  PAGINATION_PARAMS: 'PAGINATION_PARAMS',
  REQUEST_ID: 'requestId',
  CURRENT_USER: 'CurrentUser',
  COMPANY_ACCOUNT: 'companyAccount',
} as const;

// OTP
export const OTP_KEYS = {
  Login: 'Login-otp',
  Verify: 'Verify-otp',
};

// Headers
export const HEADER_KEYS = {
  OTP_TOKEN: {
    name: 'otpToken',
    key: 'x-otp-token',
  },
};

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
} as const;

// Cache
export const PREFIX_CACHE_KEYS = {
  ACCOUNT: 'ACC',
  ACCESS_TOKEN: 'ACC_TKN',
  COMPANY: 'COMP',
  COMPANY_ACCOUNT: 'COMP_ACC',
};

// Response
export const DEFAULT_SUCCESS_RESPONSE_VALUE = (options?: { ok?: boolean; statusCode?: number; timestamp?: number }) => ({
  ok: options?.ok ?? true,
  statusCode: options?.statusCode ?? 201,
  timestamp: options?.timestamp ?? 1776840452562,
});

// Config
export const CONFIG_KEYS = {
  CARD_NUMBER: 'card_number',
  CARD_OWNER_NAME: 'card_owner_name',
  TON_WALLET_ADDRESS: 'ton_wallet_address',
  PAYMENT_VERIFICATION_CHANNEL_ID: 'payment_verification_channel_id',
} as const;

// logger
export const DEFAULT_LOGGER_CONFIG = {
  level: 4, // verbose
  transports: [
    {
      type: 'console',
      enabled: true,
      options: {
        colorize: true,
      },
    },
    {
      type: 'file',
      enabled: true,
      options: {
        dirname: 'logs',
      },
    },
  ],
  clsRequestIdKey: CLS_KEYS.REQUEST_ID,
} as LoggerConfig;
