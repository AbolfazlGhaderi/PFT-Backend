import { randomUUID } from 'crypto';
import { UserStatusENUM } from '@enums';
import { TABLE_NAMES } from '@constants';
import { UserSecurityEntity } from './user-security.entity.js';
import { ApplyDeletedFilter, PrimaryColumn } from '@decorators';
import { FinancialAccountEntity } from './financial-account.entity.js';
import { TransactionEntity } from './transaction.entity.js';
import { Collection, EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { UserRepository } from '@database/repositories/user.repository.js';
import { Entity, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/decorators/legacy';

@Entity({ tableName: TABLE_NAMES.USER, repository: () => UserRepository })
@ApplyDeletedFilter()
@Unique({ properties: ['phoneNumber', 'deletedAt'] })
export class UserEntity {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'PhoneNumber', type: 'varchar', length: 12, nullable: true })
  phoneNumber?: string;

  @Property({ fieldName: 'PhoneVerifiedAt', type: 'datetime', nullable: true })
  phoneVerifiedAt?: Date;

  // @Property({ fieldName: 'Email', unique: true, nullable: true })
  // email?: string

  // @Property({ fieldName: 'EmailVerifiedAt', nullable: true })
  // emailVerifiedAt?: Date

  @Property({ fieldName: 'Status', default: UserStatusENUM.ACTIVE, type: 'tinyint' })
  status!: number;

  @Property({ nullable: true, fieldName: 'StatusReason', type: 'text' })
  statusReason?: string;

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

  @OneToMany(() => FinancialAccountEntity, account => account.user)
  financialAccounts = new Collection<FinancialAccountEntity>(this);

  @OneToMany(() => TransactionEntity, transaction => transaction.user)
  transactions = new Collection<TransactionEntity>(this);

  @OneToOne(() => UserSecurityEntity, entity => entity.user, { hidden: true })
  security?: Rel<UserSecurityEntity>;
}
