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
  clsRequestIdKey: 'x-in-request-id',
} as LoggerConfig;
