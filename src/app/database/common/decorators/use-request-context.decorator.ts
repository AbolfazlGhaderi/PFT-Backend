import { LoggerService } from 'logger-nestjs';

import { DEFAULT_LOGGER_CONFIG } from '@configs';
import { MikroORM, RequestContext } from '@mikro-orm/postgresql';

const getMethodName = (target: unknown, propertyKey: string | symbol) => {
  return propertyKey.toString();
};

export function UseRequestContext() {
  return function (
    target: any, // Class,
    propertyKey: string, // Method name
    descriptor: PropertyDescriptor, // { value: [AsyncFunction: start], writable, enumerable, configurable }
  ) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const methodName = getMethodName(target, propertyKey);
    const logger = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext(`${className}.${methodName}`);

    descriptor.value = async function (...args: any[]) {
      const orm: MikroORM = (this as any).orm;

      if (!orm) {
        logger.error('MikroORM instance not found on class (property "orm"). you must inject "orm: MikroOrm" in main class');
        throw new Error('MikroORM instance not found.');
      }

      try {
        return await RequestContext.create(orm.em, async () => {
          return await originalMethod.apply(this, args);
        });
      } catch (error) {
        logger.error('Error in RequestContext execution');
        logger.error(String(error));
        throw error;
      }
    };

    return descriptor;
  };
}
