import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { TABLE_NAMES } from '@constants';
import { UserEntity } from './user.entity.js';
import { TwoFactorMethodsENUM } from '@enums';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/database.decorators.js';
import { Collection, EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { UserSecurityRepository } from '@database/repositories/user-security.repository.js';
import { BeforeCreate, BeforeUpdate, Entity, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/decorators/legacy';
import { IdT } from '@database/common/types/id.type.js';

@Entity({ tableName: TABLE_NAMES.USER_SECURITY, repository: () => UserSecurityRepository })
@ApplyDeletedFilter()
@Unique({ properties: ['user', 'deletedAt'] })
export class UserSecurityEntity {
  [EntityRepositoryType]?: UserSecurityRepository;

  @PrimaryColumn()
  id!: number;

  @OneToOne(() => UserEntity, { nullable: false, fieldName: 'UserId', index: true, type: IdT })
  user!: Rel<UserEntity>;

  @Property({ fieldName: 'PasswordHash', type: 'varchar', length: 300, nullable: true, hidden: true })
  passwordHash?: string;

  @Property({ fieldName: 'TwoFactorEnabled', type: 'tinyint', default: 0 })
  twoFactorEnabled!: number;

  @Property({ fieldName: 'TwoFactorMethod', type: 'tinyint', comment: '1: SMS, 2: Email, 3: Authenticator', default: TwoFactorMethodsENUM.SMS })
  twoFactorMethod?: number;

  @Property({ fieldName: 'TwoFactorSecret_enc', type: 'varchar', length: 300, nullable: true })
  twoFactorSecretENC?: string;

  @Property({ fieldName: 'BackupCodes', type: 'json', nullable: true })
  backupCodes?: string[];

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

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    if (this.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
  }
}
