import { randomUUID } from 'crypto';
import { TABLE_NAMES } from '@constants';
import { ConfigTypeENUM } from '@enums';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/index.js';
import { EntityRepositoryType } from '@mikro-orm/postgresql';
import { Entity, Property, Unique } from '@mikro-orm/decorators/legacy';
import { ConfigRepository } from '@database/repositories/config.repository.js';
import { IdT } from '@database/common/types/id.type.js';

@Entity({ tableName: TABLE_NAMES.CONFIG, repository: () => ConfigRepository })
@ApplyDeletedFilter()
@Unique({
  properties: ['key'],
  where: { isDeleted: 0 },
})
export class ConfigEntity {
  [EntityRepositoryType]?: ConfigRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'Key', type: 'varchar', length: 150 })
  key!: string;

  @Property({ fieldName: 'Value', type: 'text' })
  value?: string;

  @Property({ fieldName: 'Type', type: 'smallint', default: ConfigTypeENUM.APP })
  type!: number;

  @Property({ fieldName: 'Description', type: 'text', nullable: true })
  description?: string;

  @Property({ onCreate: () => new Date(), type: 'timestamptz', name: 'CreatedAt_UTC', nullable: true })
  createdAt?: Date;

  @Property({ name: 'CreatedBy', type: IdT, nullable: true, unsigned: true })
  createdBy?: number;

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    type: 'timestamptz',
    name: 'ModifiedAt_UTC',
    defaultRaw: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  modifiedAt?: Date;

  @Property({ name: 'ModifiedBy', type: IdT, nullable: true, unsigned: true })
  modifiedBy?: number;

  @Property({ fieldName: 'IsDeleted', type: 'smallint', default: 0 })
  isDeleted!: number;
}
