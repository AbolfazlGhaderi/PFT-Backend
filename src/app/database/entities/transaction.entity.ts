import { randomUUID } from 'crypto';
import { TABLE_NAMES } from '@constants';
import { UserEntity } from './user.entity.js';
import { CategoryEntity } from './category.entity.js';
import { PaymentMethodENUM, TransactionTypeENUM } from '@enums';
import { ApplyDeletedFilter, PrimaryColumn } from '@decorators';
import { FinancialAccountEntity } from './financial-account.entity.js';
import { EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { Check, Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { TransactionRepository } from '@database/repositories/transaction.repository.js';

@Entity({ tableName: TABLE_NAMES.TRANSACTION, repository: () => TransactionRepository })
@ApplyDeletedFilter()
@Check({ expression: '("Type" IN (1, 2) AND "ToAccountId" IS NULL) OR ("Type" = 3 AND "ToAccountId" IS NOT NULL AND "AccountId" != "ToAccountId")' })
export class TransactionEntity {
  [EntityRepositoryType]?: TransactionRepository;

  @PrimaryColumn()
  id!: number;

  @ManyToOne(() => UserEntity, { nullable: false, fieldName: 'UserId', index: true, type: 'bigint' })
  user!: Rel<UserEntity>;

  @Property({ fieldName: 'Type', type: 'tinyint', default: TransactionTypeENUM.EXPENSE })
  type!: number;

  @ManyToOne(() => FinancialAccountEntity, { nullable: false, fieldName: 'AccountId', index: true, type: 'bigint' })
  account!: Rel<FinancialAccountEntity>;

  @ManyToOne(() => FinancialAccountEntity, { nullable: true, fieldName: 'ToAccountId', index: true, type: 'bigint' })
  toAccount?: Rel<FinancialAccountEntity>;

  @ManyToOne(() => CategoryEntity, { nullable: true, fieldName: 'CategoryId', index: true, type: 'bigint' })
  category?: Rel<CategoryEntity>;

  @Property({ fieldName: 'Amount', type: 'decimal', precision: 30, scale: 8, default: 0 })
  amount!: string;

  @Property({ fieldName: 'Fee', type: 'decimal', precision: 30, scale: 8, default: 0 })
  fee!: string;

  @Property({ fieldName: 'DiscountAmount', type: 'decimal', precision: 30, scale: 8, default: 0 })
  discountAmount!: string;

  @Property({ fieldName: 'TotalAmount', type: 'decimal', precision: 30, scale: 8, default: 0 })
  totalAmount!: string;

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
