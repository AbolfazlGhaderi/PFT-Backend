import { Migration } from '@mikro-orm/migrations';

export class Migration20261116034021 extends Migration {

  override name = 'Migration20261116034021';

  override up(): void | Promise<void> {
    this.addSql(`create table "Categories" ("Id" bigserial primary key, "Key" varchar(100) not null, "Value" varchar(150) not null, "Type" smallint not null, "ParentId" bigint null, "Description" text null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`create index "Categories_ParentId_index" on "Categories" ("ParentId");`);
    this.addSql(`create unique index "Categories_Key_unique" on "Categories" ("Key") where "IsDeleted" = 0;`);

    this.addSql(`create table "Currencies" ("Id" bigserial primary key, "Title" varchar(100) not null, "Code" varchar(5) not null, "Symbol" varchar(10) null, "DecimalPlaces" smallint not null default 2, "Description" text null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`create unique index "Currencies_Code_unique" on "Currencies" ("Code") where "IsDeleted" = 0;`);

    this.addSql(`create table "User" ("Id" bigserial primary key, "PhoneNumber" varchar(16) null, "PhoneVerifiedAt" timestamptz null, "Status" smallint not null default 1, "StatusReason" text null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`create unique index "User_PhoneNumber_unique" on "User" ("PhoneNumber") where "IsDeleted" = 0;`);

    this.addSql(`create table "FinancialAccounts" ("Id" bigserial primary key, "Title" varchar(100) not null, "UserId" bigint not null, "Type" smallint not null default 1, "CurrencyId" bigint not null, "InitialBalance" decimal(20,5) not null default 0, "CurrentBalance" decimal(20,5) not null default 0, "Description" text null, "IsActive" smallint not null default 1, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`create index "FinancialAccounts_UserId_index" on "FinancialAccounts" ("UserId");`);
    this.addSql(`create index "FinancialAccounts_CurrencyId_index" on "FinancialAccounts" ("CurrencyId");`);
    this.addSql(`create unique index "FinancialAccounts_UserId_Title_unique" on "FinancialAccounts" ("UserId", "Title") where "IsDeleted" = 0;`);

    this.addSql(`create table "Transactions" ("Id" bigserial primary key, "Type" smallint not null default 1, "AccountId" bigint not null, "ToAccountId" bigint null, "CategoryId" bigint null, "Amount" decimal(20,5) not null default 0, "Fee" decimal(20,5) not null default 0, "DiscountAmount" decimal(20,5) not null default 0, "TotalAmount" decimal(20,5) not null default 0, "PaymentMethod" smallint not null default 1, "Description" text null, "Invoice" varchar(300) null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`create index "Transactions_AccountId_index" on "Transactions" ("AccountId");`);
    this.addSql(`create index "Transactions_ToAccountId_index" on "Transactions" ("ToAccountId");`);
    this.addSql(`create index "Transactions_CategoryId_index" on "Transactions" ("CategoryId");`);

    this.addSql(`create table "Debts" ("Id" bigserial primary key, "Title" varchar(150) not null, "StartDate" timestamptz not null default CURRENT_TIMESTAMP, "Status" smallint not null default 1, "UserId" bigint not null, "DebtType" smallint not null default 1, "TotalAmount" decimal(20,5) not null, "InitialPayment" decimal(20,5) not null default 0, "InstallmentAmount" decimal(20,5) null, "TotalInstallments" int null, "InstallmentInterval" smallint not null default 1, "DueDate" timestamptz null, "Description" text null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`create index "Debts_UserId_index" on "Debts" ("UserId");`);

    this.addSql(`create table "DebtPayments" ("Id" bigserial primary key, "DebtId" bigint not null, "TransactionId" bigint not null, "InstallmentNumber" int null, "Amount" decimal(20,5) not null, "PaidAt" timestamptz not null default CURRENT_TIMESTAMP, "Description" text null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`create index "DebtPayments_DebtId_index" on "DebtPayments" ("DebtId");`);
    this.addSql(`create index "DebtPayments_TransactionId_index" on "DebtPayments" ("TransactionId");`);

    this.addSql(`create table "UserSecurity" ("Id" bigserial primary key, "UserId" bigint not null, "PasswordHash" varchar(300) null, "TwoFactorEnabled" smallint not null default 0, "TwoFactorMethod" smallint not null default 1, "TwoFactorSecret_enc" varchar(300) null, "BackupCodes" jsonb null, "RecordKey" varchar(36) not null, "CreatedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "CreatedBy" bigint null, "ModifiedAt_UTC" timestamptz null default CURRENT_TIMESTAMP, "ModifiedBy" bigint null, "IsDeleted" smallint not null default 0);`);
    this.addSql(`comment on column "UserSecurity"."TwoFactorMethod" is '1: SMS, 2: Email, 3: Authenticator';`);
    this.addSql(`create index "UserSecurity_UserId_index" on "UserSecurity" ("UserId");`);
    this.addSql(`create unique index "UserSecurity_UserId_unique" on "UserSecurity" ("UserId") where "IsDeleted" = 0;`);

    this.addSql(`alter table "Categories" add constraint "Categories_ParentId_foreign" foreign key ("ParentId") references "Categories" ("Id") on delete set null;`);

    this.addSql(`alter table "FinancialAccounts" add constraint "FinancialAccounts_UserId_foreign" foreign key ("UserId") references "User" ("Id");`);
    this.addSql(`alter table "FinancialAccounts" add constraint "FinancialAccounts_CurrencyId_foreign" foreign key ("CurrencyId") references "Currencies" ("Id");`);

    this.addSql(`alter table "Transactions" add constraint "Transactions_AccountId_foreign" foreign key ("AccountId") references "FinancialAccounts" ("Id");`);
    this.addSql(`alter table "Transactions" add constraint "Transactions_ToAccountId_foreign" foreign key ("ToAccountId") references "FinancialAccounts" ("Id") on delete set null;`);
    this.addSql(`alter table "Transactions" add constraint "Transactions_CategoryId_foreign" foreign key ("CategoryId") references "Categories" ("Id") on delete set null;`);
    this.addSql(`alter table "Transactions" add constraint "Transactions_check" check (("Type" IN (1, 2) AND "ToAccountId" IS NULL) OR ("Type" = 3 AND ("ToAccountId" IS NULL OR "AccountId" != "ToAccountId")));`);

    this.addSql(`alter table "Debts" add constraint "Debts_UserId_foreign" foreign key ("UserId") references "User" ("Id");`);
    this.addSql(`alter table "Debts" add constraint "Debts_check" check ("InitialPayment" <= "TotalAmount");`);

    this.addSql(`alter table "DebtPayments" add constraint "DebtPayments_DebtId_foreign" foreign key ("DebtId") references "Debts" ("Id");`);
    this.addSql(`alter table "DebtPayments" add constraint "DebtPayments_TransactionId_foreign" foreign key ("TransactionId") references "Transactions" ("Id");`);

    this.addSql(`alter table "UserSecurity" add constraint "UserSecurity_UserId_foreign" foreign key ("UserId") references "User" ("Id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "Categories" drop constraint "Categories_ParentId_foreign";`);
    this.addSql(`alter table "Transactions" drop constraint "Transactions_CategoryId_foreign";`);
    this.addSql(`alter table "FinancialAccounts" drop constraint "FinancialAccounts_CurrencyId_foreign";`);
    this.addSql(`alter table "FinancialAccounts" drop constraint "FinancialAccounts_UserId_foreign";`);
    this.addSql(`alter table "Debts" drop constraint "Debts_UserId_foreign";`);
    this.addSql(`alter table "UserSecurity" drop constraint "UserSecurity_UserId_foreign";`);
    this.addSql(`alter table "Transactions" drop constraint "Transactions_AccountId_foreign";`);
    this.addSql(`alter table "Transactions" drop constraint "Transactions_ToAccountId_foreign";`);
    this.addSql(`alter table "DebtPayments" drop constraint "DebtPayments_TransactionId_foreign";`);
    this.addSql(`alter table "DebtPayments" drop constraint "DebtPayments_DebtId_foreign";`);

    this.addSql(`drop table if exists "Categories" cascade;`);
    this.addSql(`drop table if exists "Currencies" cascade;`);
    this.addSql(`drop table if exists "User" cascade;`);
    this.addSql(`drop table if exists "FinancialAccounts" cascade;`);
    this.addSql(`drop table if exists "Transactions" cascade;`);
    this.addSql(`drop table if exists "Debts" cascade;`);
    this.addSql(`drop table if exists "DebtPayments" cascade;`);
    this.addSql(`drop table if exists "UserSecurity" cascade;`);
  }

}
