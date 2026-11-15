import { Migration } from '@mikro-orm/migrations';

export class Migration20261115050620 extends Migration {
  override name = 'Migration20261115050620';

  override up(): void | Promise<void> {
    this.addSql(`alter table "Transactions" drop constraint "Transactions_UserId_foreign";`);

    this.addSql(`drop index "Transactions_UserId_index";`);
    this.addSql(`alter table "Transactions" drop column "UserId";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "Transactions" add "UserId" bigint not null;`);
    this.addSql(`alter table "Transactions" add constraint "Transactions_UserId_foreign" foreign key ("UserId") references "User" ("Id");`);
    this.addSql(`create index "Transactions_UserId_index" on "Transactions" ("UserId");`);
  }
}
