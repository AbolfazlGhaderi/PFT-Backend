import { ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { EventArgs } from '@mikro-orm/postgresql';
import { CLS_KEYS, DEFAULT_LOGGER_CONFIG } from '@constants';

@Injectable()
export class AuditSubscriber {
  private readonly logger: LoggerService = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext(AuditSubscriber.name);
  constructor(private readonly cls: ClsService) {}

  getSubscribedEntities(): any[] {
    return [];
  }

  async beforeCreate(arguments_: EventArgs<any>): Promise<void> {
    const entity = arguments_.entity;
    const user = this.cls.get(CLS_KEYS.CURRENT_USER);
    if (!user?.id || !entity) return;

    this.logger.verbose(`Current User: ${user.id}`);
    if (entity.hasOwnProperty('createdBy')) entity.createdBy = user.id;
  }

  async beforeUpdate(arguments_: EventArgs<any>): Promise<void> {
    const entity = arguments_.entity;
    const user = this.cls.get(CLS_KEYS.CURRENT_USER);
    if (!user?.id || !entity) return;

    this.logger.verbose(`Current User: ${user.id}`);
    if (entity.hasOwnProperty('modifiedBy')) entity.modifiedBy = user.id;
  }
}
