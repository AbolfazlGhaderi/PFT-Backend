import { Type } from '@mikro-orm/postgresql';
import { Decimal } from 'decimal.js';

export class MoneyT extends Type<Decimal, string> {
  override convertToDatabaseValue(value: Decimal): string {
    return value.toString();
  }

  override convertToJSValue(value: string): Decimal {
    return new Decimal(value);
  }

  override getColumnType(): string {
    return 'decimal(20,5)';
  }
}
