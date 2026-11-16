import { randomUUID } from 'crypto';
import { TABLE_NAMES } from '@constants';
import { DebtStatusENUM, DebtTypeENUM, InstallmentIntervalENUM } from '@enums';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/index.js';
import { MoneyT } from '@database/common/types/money.type.js';
import { Check, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { DebtRepository } from '@database/repositories/debt.repository.js';
import { EntityRepositoryType, Collection, type Rel } from '@mikro-orm/postgresql';
import { IdT } from '@database/common/types/id.type.js';
import { Decimal } from 'decimal.js';
import { DebtPaymentEntity } from './debt-payment.entity.js';
import { UserEntity } from './user.entity.js';

@Entity({ tableName: TABLE_NAMES.DEBT, repository: () => DebtRepository })
@ApplyDeletedFilter()
@Check({ expression: '"InitialPayment" <= "TotalAmount"' })
export class DebtEntity {
  [EntityRepositoryType]?: DebtRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'Title', type: 'varchar', length: 150 })
  title!: string;

  @Property({ fieldName: 'StartDate', type: 'timestamptz', onCreate: () => new Date(), defaultRaw: 'CURRENT_TIMESTAMP' })
  startDate!: Date;

  @Property({ fieldName: 'Status', type: 'smallint', default: DebtStatusENUM.ACTIVE })
  status!: number;

  @ManyToOne(() => UserEntity, { nullable: false, fieldName: 'UserId', index: true, type: IdT })
  user!: Rel<UserEntity>;

  @Property({ fieldName: 'DebtType', type: 'smallint', default: DebtTypeENUM.PERSONAL })
  debtType!: number;

  @Property({ fieldName: 'TotalAmount', type: MoneyT, unsigned: true })
  totalAmount!: Decimal;

  @Property({ fieldName: 'InitialPayment', type: MoneyT, default: 0, unsigned: true })
  initialPayment!: Decimal;

  @Property({ fieldName: 'InstallmentAmount', type: MoneyT, nullable: true, unsigned: true })
  installmentAmount?: Decimal;

  @Property({ fieldName: 'TotalInstallments', type: 'integer', nullable: true, unsigned: true })
  totalInstallments?: number;

  @Property({ fieldName: 'InstallmentInterval', type: 'smallint', default: InstallmentIntervalENUM.ONE_TIME })
  installmentInterval!: number;

  @Property({ fieldName: 'DueDate', type: 'timestamptz', nullable: true })
  dueDate?: Date;

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

  @Property({ fieldName: 'IsDeleted', type: 'smallint', default: 0 })
  isDeleted!: number;

  @OneToMany(() => DebtPaymentEntity, payment => payment.debt)
  payments = new Collection<DebtPaymentEntity>(this);
}
