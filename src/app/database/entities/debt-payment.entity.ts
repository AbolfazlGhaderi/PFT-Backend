import { randomUUID } from 'crypto';
import { TABLE_NAMES } from '@constants';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/database.decorators.js';
import { EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { DebtPaymentRepository } from '@database/repositories/debt-payment.repository.js';
import { IdT } from '@database/common/types/id.type.js';
import { MoneyT } from '@database/common/types/money.type.js';
import { Decimal } from 'decimal.js';
import { DebtEntity } from './debt.entity.js';
import { TransactionEntity } from './transaction.entity.js';

@Entity({ tableName: TABLE_NAMES.DEBT_PAYMENT, repository: () => DebtPaymentRepository })
@ApplyDeletedFilter()
export class DebtPaymentEntity {
  [EntityRepositoryType]?: DebtPaymentRepository;

  @PrimaryColumn()
  id!: number;

  @ManyToOne(() => DebtEntity, { nullable: false, fieldName: 'DebtId', index: true, type: IdT, unsigned: true })
  debt!: Rel<DebtEntity>;

  @ManyToOne(() => TransactionEntity, { nullable: false, fieldName: 'TransactionId', index: true, type: IdT, unsigned: true })
  transaction!: Rel<TransactionEntity>;

  @Property({ fieldName: 'InstallmentNumber', type: 'integer', nullable: true, unsigned: true })
  installmentNumber?: number;

  @Property({ fieldName: 'Amount', type: MoneyT })
  amount!: Decimal;

  @Property({ fieldName: 'PaidAt', type: 'timestamptz', onCreate: () => new Date(), defaultRaw: 'CURRENT_TIMESTAMP' })
  paidAt!: Date;

  @Property({ fieldName: 'Description', type: 'text', nullable: true })
  description?: string;

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
}
