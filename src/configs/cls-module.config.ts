import { CLS_KEYS } from '@constants';
import { randomUUID } from 'node:crypto';
import { ClsModuleOptions } from 'nestjs-cls';
import { Response } from 'express';

export const CLS_MODULE_CONFIG = {
  global: true,
  middleware: {
    mount: true,
    setup: (cls, req, res: Response) => {
      const requestIdKey = CLS_KEYS.REQUEST_ID;
      // const requestId = Reflect.get(response || {}, requestIdKey)  //TODO: Get and if is empty => throw error 500
      cls.set(requestIdKey, res.getHeader(requestIdKey) ?? randomUUID());
    },
  },
} as ClsModuleOptions;
