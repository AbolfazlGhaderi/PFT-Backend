import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { TABLE_NAMES } from '@constants';
import { UserStatusENUM } from '@enums';
import { UserRepository } from '@db-repositories';
import { ApplyDeletedFilter } from '@decorators';
import { EntityRepositoryType } from '@mikro-orm/postgresql';
import { BeforeCreate, BeforeUpdate, Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity({ tableName: TABLE_NAMES.USER, repository: () => UserRepository })
@ApplyDeletedFilter()
export class UserEntity {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({ autoincrement: true, name: 'Id', type: 'bigint', unsigned: true })
  id!: number;

  @Property({ unique: true, fieldName: 'PhoneNumber', type: 'varchar', length: 12, nullable: true })
  phoneNumber?: string;

  @Property({ fieldName: 'PhoneVerifiedAt', type: 'datetime', nullable: true })
  phoneVerifiedAt?: Date;

  // @Property({ fieldName: 'Email', unique: true, nullable: true })
  // email?: string

  // @Property({ fieldName: 'EmailVerifiedAt', nullable: true })
  // emailVerifiedAt?: Date

  @Property({ fieldName: 'PasswordHash', type: 'varchar', length: 255, nullable: true, hidden: true })
  passwordHash?: string;

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

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    if (this.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
  }
}
