import { Migration } from '@mikro-orm/migrations';

export class Migration20261117195223 extends Migration {

  override name = 'Migration20261117195223';

  override up(): void | Promise<void> {
    this.addSql(`alter table "Transactions" add "PaymentDate" timestamptz not null default CURRENT_TIMESTAMP;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "Transactions" drop column "PaymentDate";`);
  }

}
