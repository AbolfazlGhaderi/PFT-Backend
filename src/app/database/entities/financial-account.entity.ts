import { Decimal } from 'decimal.js';
import { randomUUID } from 'crypto';
import { TABLE_NAMES } from '@constants';
import { UserEntity } from './user.entity.js';
import { FinancialAccountTypeENUM } from '@enums';
import { CurrencyEntity } from './currency.entity.js';
import { IdT } from '@database/common/types/id.type.js';
import { TransactionEntity } from './transaction.entity.js';
import { MoneyT } from '@database/common/types/money.type.js';
import { EntityRepositoryType, Collection, type Rel } from '@mikro-orm/postgresql';
import { Entity, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/decorators/legacy';
import { FinancialAccountRepository } from '@database/repositories/financial-account.repository.js';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/database.decorators.js';

@Entity({ tableName: TABLE_NAMES.FINANCIAL_ACCOUNT, repository: () => FinancialAccountRepository })
@ApplyDeletedFilter()
@Unique({ properties: ['user', 'title', 'deletedAt'] })
export class FinancialAccountEntity {
  [EntityRepositoryType]?: FinancialAccountRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'Title', type: 'varchar', length: 100 })
  title!: string;

  @ManyToOne(() => UserEntity, { nullable: false, fieldName: 'UserId', index: true, type: IdT })
  user!: Rel<UserEntity>;

  @Property({ fieldName: 'Type', type: 'smallint', default: FinancialAccountTypeENUM.BANK })
  type!: number;

  @ManyToOne(() => CurrencyEntity, { nullable: false, fieldName: 'CurrencyId', index: true, type: IdT })
  currency!: Rel<CurrencyEntity>;

  @Property({ fieldName: 'InitialBalance', type: MoneyT, default: 0 })
  initialBalance!: Decimal;

  @Property({ fieldName: 'CurrentBalance', type: MoneyT, default: 0 })
  currentBalance!: Decimal;

  @Property({ fieldName: 'Description', type: 'text', nullable: true })
  description?: string;

  @Property({ fieldName: 'IsActive', type: 'smallint', default: 1 })
  isActive!: number; // 0 or 1

  @Property({ onCreate: () => randomUUID(), fieldName: 'RecordKey', nullable: false, type: 'varchar', length: 36 })
  recordKey?: string;

  @Property({ onCreate: () => new Date(), type: 'timestamptz', name: 'CreatedAt_UTC', defaultRaw: 'CURRENT_TIMESTAMP', nullable: true })
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

  @Property({ fieldName: 'DeletedAt_UTC', type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => TransactionEntity, transaction => transaction.account)
  transactions = new Collection<TransactionEntity>(this);

  @OneToMany(() => TransactionEntity, transaction => transaction.toAccount)
  incomingTransfers = new Collection<TransactionEntity>(this);
}
