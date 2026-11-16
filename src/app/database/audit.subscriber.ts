// oxlint-disable typescript/no-explicit-any
import { ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { EventArgs } from '@mikro-orm/postgresql';
import { CLS_KEYS, DEFAULT_LOGGER_CONFIG } from '@constants';
import { UserEntity } from './entities/user.entity.js';

@Injectable()
export class AuditSubscriber {
  private readonly logger: LoggerService = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext(AuditSubscriber.name);
  constructor(private readonly cls: ClsService) {}

  getSubscribedEntities(): any[] {
    return [];
  }

  async beforeCreate(arguments_: EventArgs<unknown>): Promise<void> {
    const entity = arguments_.entity;
    const user = this.cls.get<UserEntity>(CLS_KEYS.CURRENT_USER);
    if (!user?.id || !entity) return;

    this.logger.verbose(`Current User: ${user.id}`);
    if (entity.hasOwnProperty('createdBy')) Reflect.set(entity, 'createdBy', user.id);
  }

  async beforeUpdate(arguments_: EventArgs<unknown>): Promise<void> {
    const entity = arguments_.entity;
    const user = this.cls.get<UserEntity>(CLS_KEYS.CURRENT_USER);
    if (!user?.id || !entity) return;

    this.logger.verbose(`Current User: ${user.id}`);
    if (entity.hasOwnProperty('modifiedBy')) Reflect.set(entity, 'modifiedBy', user.id);
  }
}
