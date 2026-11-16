import { randomUUID } from 'crypto';
import { Decimal } from 'decimal.js';
import { TABLE_NAMES } from '@constants';
import { CategoryEntity } from './category.entity.js';
import { IdT } from '@database/common/types/id.type.js';
import { PaymentMethodENUM, TransactionTypeENUM } from '@enums';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/index.js';
import { MoneyT } from '@database/common/types/money.type.js';
import { FinancialAccountEntity } from './financial-account.entity.js';
import { EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { Check, Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { TransactionRepository } from '@database/repositories/transaction.repository.js';

@Entity({ tableName: TABLE_NAMES.TRANSACTION, repository: () => TransactionRepository })
@ApplyDeletedFilter()
@Check({ expression: '("Type" IN (1, 2) AND "ToAccountId" IS NULL) OR ("Type" = 3 AND ("ToAccountId" IS NULL OR "AccountId" != "ToAccountId"))' })
export class TransactionEntity {
  [EntityRepositoryType]?: TransactionRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'Type', type: 'tinyint', default: TransactionTypeENUM.EXPENSE })
  type!: number;

  @ManyToOne(() => FinancialAccountEntity, { nullable: false, fieldName: 'AccountId', index: true, type: IdT })
  account!: Rel<FinancialAccountEntity>;

  @ManyToOne(() => FinancialAccountEntity, { nullable: true, fieldName: 'ToAccountId', index: true, type: IdT })
  toAccount?: Rel<FinancialAccountEntity>;

  @ManyToOne(() => CategoryEntity, { nullable: true, fieldName: 'CategoryId', index: true, type: IdT })
  category?: Rel<CategoryEntity>;

  @Property({ fieldName: 'Amount', type: MoneyT, default: 0 })
  amount!: Decimal;

  @Property({ fieldName: 'Fee', type: MoneyT, default: 0 })
  fee!: Decimal;

  @Property({ fieldName: 'DiscountAmount', type: MoneyT, default: 0 })
  discountAmount!: Decimal;

  @Property({ fieldName: 'TotalAmount', type: MoneyT, default: 0 })
  totalAmount!: Decimal;

  @Property({ fieldName: 'PaymentMethod', type: 'smallint', default: PaymentMethodENUM.CARD })
  paymentMethod!: number;

  @Property({ fieldName: 'Description', type: 'text', nullable: true })
  description?: string;

  @Property({ fieldName: 'Invoice', type: 'varchar', length: 300, nullable: true })
  invoice?: string;

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

  @Property({ fieldName: 'IsDeleted', type: 'smallint', default: 0 })
  isDeleted!: number;
}
