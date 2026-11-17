import { Migration } from '@mikro-orm/migrations';

export class Migration20261117123655 extends Migration {

  override name = 'Migration20261117123655';

  override up(): void | Promise<void> {
    this.addSql(`create table "Configs" ("Id" bigserial primary key, "Key" varchar(150) not null, "Value" text not null, "Type" smallint not null default 1, "Description" text null, "CreatedAt_UTC" timestamptz null, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`create unique index "Configs_Key_unique" on "Configs" ("Key") where "IsDeleted" = 0;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "Configs" cascade;`);
  }

}
