import { Migration } from '@mikro-orm/migrations';

export class Migration20261114091348 extends Migration {
  override name = 'Migration20261114091348';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "User" ("Id" bigserial primary key, "PhoneNumber" varchar(12) null, "PhoneVerifiedAt" timestamptz null, "PasswordHash" varchar(255) null, "Status" smallint not null default 1, "StatusReason" text null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "DeletedAt_UTC" timestamptz null);`,
    );
    this.addSql(`alter table "User" add constraint "User_PhoneNumber_unique" unique ("PhoneNumber");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "User" cascade;`);
  }
}
