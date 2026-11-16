import { randomUUID } from 'crypto';
import { UserStatusENUM } from '@enums';
import { TABLE_NAMES } from '@constants';
import { DebtEntity } from './debt.entity.js';
import { IdT } from '@database/common/types/id.type.js';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/index.js';
import { UserSecurityEntity } from './user-security.entity.js';
import { FinancialAccountEntity } from './financial-account.entity.js';
import { UserRepository } from '@database/repositories/user.repository.js';
import { Collection, EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { Entity, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/decorators/legacy';

@Entity({ tableName: TABLE_NAMES.USER, repository: () => UserRepository })
@ApplyDeletedFilter()
@Unique({
  properties: ['phoneNumber'],
  where: { isDeleted: 0 },
})
export class UserEntity {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'PhoneNumber', type: 'varchar', length: 16, nullable: true })
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

  @Property({ name: 'CreatedBy', type: IdT, unsigned: true, nullable: true })
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

  @Property({ name: 'ModifiedBy', type: IdT, unsigned: true, nullable: true })
  modifiedBy?: number;

  @Property({ fieldName: 'IsDeleted', type: 'smallint', default: 0 })
  isDeleted!: number;

  @OneToMany(() => FinancialAccountEntity, account => account.user)
  financialAccounts = new Collection<FinancialAccountEntity>(this);

  @OneToMany(() => DebtEntity, debt => debt.user)
  debts?: Rel<DebtEntity>;

  @OneToOne(() => UserSecurityEntity, entity => entity.user, { hidden: true, unique: false })
  security?: Rel<UserSecurityEntity>;
}
