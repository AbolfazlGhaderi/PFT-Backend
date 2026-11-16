import { TABLE_NAMES } from '@constants';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/index.js';
import { Collection, EntityRepositoryType } from '@mikro-orm/postgresql';
import { Entity, OneToMany, Property, Unique } from '@mikro-orm/decorators/legacy';
import { CurrencyRepository } from '@database/repositories/currency.repository.js';
import { FinancialAccountEntity } from './financial-account.entity.js';
import { IdT } from '@database/common/types/id.type.js';

@Entity({ tableName: TABLE_NAMES.CURRENCY, repository: () => CurrencyRepository })
@ApplyDeletedFilter()
@Unique({
  properties: ['code'],
  where: { isDeleted: 0 },
})
export class CurrencyEntity {
  [EntityRepositoryType]?: CurrencyRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'Title', type: 'varchar', length: 100 })
  title!: string;

  @Property({ fieldName: 'Code', type: 'varchar', length: 5 })
  code!: string;

  @Property({ fieldName: 'Symbol', type: 'varchar', length: 10, nullable: true })
  symbol?: string;

  @Property({ fieldName: 'DecimalPlaces', type: 'smallint', default: 2 })
  decimalPlaces: number = 2;

  @Property({ fieldName: 'Description', type: 'text', nullable: true })
  description?: string;

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

  @OneToMany(() => FinancialAccountEntity, entity => entity.currency)
  financialAccounts = new Collection<FinancialAccountEntity>(this);
}
