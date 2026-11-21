import { Migration } from '@mikro-orm/migrations';

export class Migration20261121092630 extends Migration {

  override name = 'Migration20261121092630';

  override up(): void | Promise<void> {
    this.addSql(`alter table "Debts" add "NextPaymentDate" timestamptz null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "Debts" drop column "NextPaymentDate";`);
  }

}
