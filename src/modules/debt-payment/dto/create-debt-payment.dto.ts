import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateDebtPaymentDTO {
  @ApiProperty({ example: 1, description: 'Debt ID' })
  @IsNumber()
  @IsNotEmpty()
  debtId!: number;

  @ApiProperty({ example: 1, description: 'Paying transaction ID' })
  @IsNumber()
  @IsNotEmpty()
  transactionId!: number;

  @ApiProperty({ example: 3, description: 'Installment number (> 0)', required: false })
  @IsNumber()
  @IsOptional()
  installmentNumber?: number;

  @ApiProperty({ example: '500', description: 'Paid amount (> 0, decimal as string)' })
  @IsNumberString()
  @IsNotEmpty()
  amount!: string;

  @ApiProperty({ example: '2026-11-15T00:00:00.000Z', description: 'Paid at (ISO 8601)', required: false })
  @IsISO8601()
  @IsOptional()
  paidAt?: string;

  @ApiProperty({ example: '2026-12-15T00:00:00.000Z', description: 'Next payment date for the debt (ISO 8601)', required: false })
  @IsISO8601()
  @IsOptional()
  nextPaymentDate?: string;

  @ApiProperty({ example: 'Third installment', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
