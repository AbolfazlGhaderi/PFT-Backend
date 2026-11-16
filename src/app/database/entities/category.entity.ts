import { TABLE_NAMES } from '@constants';
import { Collection, EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { Entity, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/decorators/legacy';
import { CategoryRepository } from '@database/repositories/category.repository.js';
import { TransactionEntity } from './transaction.entity.js';
import { IdT } from '@database/common/types/id.type.js';
import { ApplyDeletedFilter, PrimaryColumn } from '@database/common/decorators/index.js';

@Entity({ tableName: TABLE_NAMES.CATEGORY, repository: () => CategoryRepository })
@ApplyDeletedFilter()
@Unique({
    properties: ['key'],
    where: { isDeleted: 0 },
})
export class CategoryEntity {
  [EntityRepositoryType]?: CategoryRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'Key', type: 'varchar', length: 100 })
  key!: string;

  @Property({ fieldName: 'Value', type: 'varchar', length: 150 })
  value!: string;

  @Property({ fieldName: 'Type', type: 'smallint', nullable: false })
  type!: number;

  @ManyToOne(() => CategoryEntity, { nullable: true, fieldName: 'ParentId', index: true, type: IdT })
  parent?: Rel<CategoryEntity>;

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

  @OneToMany(() => CategoryEntity, category => category.parent)
  children = new Collection<CategoryEntity>(this);

  @OneToMany(() => TransactionEntity, transaction => transaction.category)
  transactions = new Collection<TransactionEntity>(this);
}
