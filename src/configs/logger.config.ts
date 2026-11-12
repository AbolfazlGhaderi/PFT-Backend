import { CLS_KEYS } from '@constants';
import { LoggerConfig } from 'logger-nestjs';

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
