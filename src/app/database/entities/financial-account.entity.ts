import { randomUUID } from 'crypto';
import { TABLE_NAMES } from '@constants';
import { UserEntity } from './user.entity.js';
import { CurrencyEntity } from './currency.entity.js';
import { EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { ApplyDeletedFilter, PrimaryColumn } from '@decorators';
import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/decorators/legacy';
import { FinancialAccountRepository } from '@database/repositories/financial-account.repository.js';

@Entity({ tableName: TABLE_NAMES.FINANCIAL_ACCOUNT, repository: () => FinancialAccountRepository })
@ApplyDeletedFilter()
@Unique({ properties: ['user', 'title', 'deletedAt'] })
export class FinancialAccountEntity {
  [EntityRepositoryType]?: FinancialAccountRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'Title', type: 'varchar', length: 100 })
  title!: string;

  @ManyToOne(() => UserEntity, { nullable: false, fieldName: 'UserId', index: true, type: 'bigint' })
  user!: Rel<UserEntity>;

  @Property({ fieldName: 'Type', type: 'smallint' })
  type!: number;

  @ManyToOne(() => CurrencyEntity, { nullable: false, fieldName: 'CurrencyId', index: true, type: 'bigint' })
  currency!: Rel<CurrencyEntity>;

  @Property({ fieldName: 'InitialBalance', type: 'decimal', precision: 18, scale: 2, default: 0 })
  initialBalance!: string;

  @Property({ fieldName: 'CurrentBalance', type: 'decimal', precision: 18, scale: 2, default: 0 })
  currentBalance!: string;

  @Property({ fieldName: 'Description', type: 'text', nullable: true })
  description?: string;

  @Property({ onCreate: () => randomUUID(), fieldName: 'RecordKey', nullable: false, type: 'varchar', length: 36 })
  recordKey?: string;

  @Property({ onCreate: () => new Date(), type: 'timestamptz', name: 'CreatedAt_UTC', defaultRaw: 'CURRENT_TIMESTAMP', nullable: true })
  createdAt?: Date;

  @Property({ name: 'CreatedBy', type: 'bigint', unsigned: true, nullable: true })
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

  @Property({ name: 'ModifiedBy', type: 'bigint', unsigned: true, nullable: true })
  modifiedBy?: number;

  @Property({ fieldName: 'DeletedAt_UTC', type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
