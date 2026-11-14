import { TABLE_NAMES } from '@constants';
import { ApplyDeletedFilter, PrimaryColumn } from '@decorators';
import { Collection, EntityRepositoryType, type Rel } from '@mikro-orm/postgresql';
import { Entity, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/decorators/legacy';
import { CategoryRepository } from '@database/repositories/category.repository.js';
import { TransactionEntity } from './transaction.entity.js';

@Entity({ tableName: TABLE_NAMES.CATEGORY, repository: () => CategoryRepository })
@ApplyDeletedFilter()
@Unique({ properties: ['key', 'deletedAt'] })
export class CategoryEntity {
  [EntityRepositoryType]?: CategoryRepository;

  @PrimaryColumn()
  id!: number;

  @Property({ fieldName: 'Key', type: 'varchar', length: 100 })
  key!: string;

  @Property({ fieldName: 'Value', type: 'varchar', length: 150 })
  value!: string;

  @ManyToOne(() => CategoryEntity, { nullable: true, fieldName: 'ParentId', index: true, type: 'bigint' })
  parent?: Rel<CategoryEntity>;

  @Property({ fieldName: 'Description', type: 'text', nullable: true })
  description?: string;

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

  @OneToMany(() => CategoryEntity, category => category.parent)
  children = new Collection<CategoryEntity>(this);

  @OneToMany(() => TransactionEntity, transaction => transaction.category)
  transactions = new Collection<TransactionEntity>(this);
}
