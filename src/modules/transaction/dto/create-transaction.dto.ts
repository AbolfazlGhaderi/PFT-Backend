import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsISO8601, IsNumber, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

import { PaymentMethodENUM, TransactionTypeENUM } from '@enums';

export class CreateTransactionDTO {
  @ApiProperty({ example: 'Grocery Shopping', description: 'Transaction title (max 255 chars)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiProperty({ example: TransactionTypeENUM.EXPENSE, description: '1: Expense, 2: Income, 3: Transfer' })
  @IsEnum(TransactionTypeENUM)
  @IsNotEmpty()
  type!: number;

  @ApiProperty({ example: 1, description: 'Source financial account ID' })
  @IsNumber()
  @IsNotEmpty()
  accountId!: number;

  @ApiProperty({ example: 2, description: 'Destination account ID (TRANSFER only; omit for external transfers)', required: false })
  @IsNumber()
  @IsOptional()
  toAccountId?: number;

  @ApiProperty({ example: 5, description: 'Category ID', required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: '1000.50', description: 'Amount (decimal as string, > 0)' })
  @IsNumberString()
  @IsNotEmpty()
  amount!: string;

  @ApiProperty({ example: '10', description: 'Fee (decimal as string, >= 0)', required: false })
  @IsNumberString()
  @IsOptional()
  fee?: string;

  @ApiProperty({ example: '5', description: 'Discount amount (decimal as string, >= 0)', required: false })
  @IsNumberString()
  @IsOptional()
  discountAmount?: string;

  @ApiProperty({
    example: PaymentMethodENUM.CARD,
    description: '0: Cash, 1: Card, 2: OnlinePayment, 3: CardToCard, 4: Bridge, 5: Paya, 6: Satna, 7: InBank, 8: BankTransfer, 9: Wallet, 10: BlueToBlue',
    required: false,
  })
  @IsEnum(PaymentMethodENUM)
  @IsOptional()
  paymentMethod?: number;

  @ApiProperty({ example: '2026-11-17T10:00:00.000Z', description: 'Payment date (ISO 8601; defaults to now)', required: false })
  @IsISO8601()
  @IsOptional()
  paymentDate?: string;

  @ApiProperty({ example: 'Grocery shopping', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'invoice-2026-001', description: 'Invoice reference', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  invoice?: string;
}
