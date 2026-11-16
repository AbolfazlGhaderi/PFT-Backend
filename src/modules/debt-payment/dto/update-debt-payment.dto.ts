import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdateDebtPaymentDTO {
  @ApiProperty({ example: 1, description: 'Debt payment ID' })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 3, description: 'Installment number (> 0)', required: false })
  @IsNumber()
  @IsOptional()
  installmentNumber?: number;

  @ApiProperty({ example: '500', description: 'Paid amount (> 0)', required: false })
  @IsNumberString()
  @IsOptional()
  amount?: string;

  @ApiProperty({ example: '2026-11-15T00:00:00.000Z', description: 'Paid at (ISO 8601)', required: false })
  @IsISO8601()
  @IsOptional()
  paidAt?: string;

  @ApiProperty({ example: 'Third installment', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
