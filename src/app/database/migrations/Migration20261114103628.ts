import { Migration } from '@mikro-orm/migrations';

export class Migration20261114103628 extends Migration {

  override name = 'Migration20261114103628';

  override up(): void | Promise<void> {
    this.addSql(`create table "Currencies" ("Id" bigserial primary key, "Title" varchar(100) not null, "Code" varchar(5) not null, "Symbol" varchar(10) null, "DecimalPlaces" smallint not null default 2, "Description" text null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "DeletedAt_UTC" timestamptz null);`);
    this.addSql(`alter table "Currencies" add constraint "Currencies_Code_DeletedAt_UTC_unique" unique ("Code", "DeletedAt_UTC");`);

    this.addSql(`create table "User" ("Id" bigserial primary key, "PhoneNumber" varchar(12) null, "PhoneVerifiedAt" timestamptz null, "Status" smallint not null default 1, "StatusReason" text null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "DeletedAt_UTC" timestamptz null);`);
    this.addSql(`alter table "User" add constraint "User_PhoneNumber_DeletedAt_UTC_unique" unique ("PhoneNumber", "DeletedAt_UTC");`);

    this.addSql(`create table "FinancialAccounts" ("Id" bigserial primary key, "Title" varchar(100) not null, "UserId" bigint not null, "Type" smallint not null, "CurrencyId" bigint not null, "InitialBalance" numeric(18,2) not null default 0, "CurrentBalance" numeric(18,2) not null default 0, "Description" text null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "DeletedAt_UTC" timestamptz null);`);
    this.addSql(`create index "FinancialAccounts_UserId_index" on "FinancialAccounts" ("UserId");`);
    this.addSql(`create index "FinancialAccounts_CurrencyId_index" on "FinancialAccounts" ("CurrencyId");`);
    this.addSql(`alter table "FinancialAccounts" add constraint "FinancialAccounts_UserId_Title_DeletedAt_UTC_unique" unique ("UserId", "Title", "DeletedAt_UTC");`);

    this.addSql(`create table "UserSecurity" ("Id" bigserial primary key, "UserId" bigint not null, "PasswordHash" varchar(300) null, "TwoFactorEnabled" smallint not null default 0, "TwoFactorMethod" smallint not null default 1, "TwoFactorSecret_enc" varchar(300) null, "BackupCodes" jsonb null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "DeletedAt_UTC" timestamptz null);`);
    this.addSql(`comment on column "UserSecurity"."TwoFactorMethod" is '1: SMS, 2: Email, 3: Authenticator';`);
    this.addSql(`create index "UserSecurity_UserId_index" on "UserSecurity" ("UserId");`);
    this.addSql(`alter table "UserSecurity" add constraint "UserSecurity_UserId_unique" unique ("UserId");`);
    this.addSql(`alter table "UserSecurity" add constraint "UserSecurity_UserId_DeletedAt_UTC_unique" unique ("UserId", "DeletedAt_UTC");`);

    this.addSql(`alter table "FinancialAccounts" add constraint "FinancialAccounts_UserId_foreign" foreign key ("UserId") references "User" ("Id");`);
    this.addSql(`alter table "FinancialAccounts" add constraint "FinancialAccounts_CurrencyId_foreign" foreign key ("CurrencyId") references "Currencies" ("Id");`);

    this.addSql(`alter table "UserSecurity" add constraint "UserSecurity_UserId_foreign" foreign key ("UserId") references "User" ("Id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "FinancialAccounts" drop constraint "FinancialAccounts_CurrencyId_foreign";`);
    this.addSql(`alter table "FinancialAccounts" drop constraint "FinancialAccounts_UserId_foreign";`);
    this.addSql(`alter table "UserSecurity" drop constraint "UserSecurity_UserId_foreign";`);

    this.addSql(`drop table if exists "Currencies" cascade;`);
    this.addSql(`drop table if exists "User" cascade;`);
    this.addSql(`drop table if exists "FinancialAccounts" cascade;`);
    this.addSql(`drop table if exists "UserSecurity" cascade;`);
  }

}
