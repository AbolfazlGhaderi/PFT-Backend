import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

import { DebtStatusENUM, DebtTypeENUM, InstallmentIntervalENUM } from '@enums';

export class UpdateDebtDTO {
  @ApiProperty({ example: 1, description: 'Debt ID' })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 'Bank loan', description: 'Debt title', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  title?: string;

  @ApiProperty({ example: '2026-11-15T00:00:00.000Z', description: 'Start date (ISO 8601)', required: false })
  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: DebtStatusENUM.ACTIVE, description: '1: Active, 2: PaidOff, 3: Cancelled', required: false })
  @IsEnum(DebtStatusENUM)
  @IsOptional()
  status?: number;

  @ApiProperty({ example: DebtTypeENUM.BANK_LOAN, description: '1: Personal, 2: CreditInstallment, 3: BankLoan', required: false })
  @IsEnum(DebtTypeENUM)
  @IsOptional()
  debtType?: number;

  @ApiProperty({ example: '12000', description: 'Total amount (> 0)', required: false })
  @IsNumberString()
  @IsOptional()
  totalAmount?: string;

  @ApiProperty({ example: '2000', description: 'Initial payment (0..TotalAmount)', required: false })
  @IsNumberString()
  @IsOptional()
  initialPayment?: string;

  @ApiProperty({ example: '500', description: 'Installment amount', required: false })
  @IsNumberString()
  @IsOptional()
  installmentAmount?: string;

  @ApiProperty({ example: 24, description: 'Total installments', required: false })
  @IsNumber()
  @IsOptional()
  totalInstallments?: number;

  @ApiProperty({
    example: InstallmentIntervalENUM.MONTHLY,
    description: '1: OneTime, 2: Daily, 3: Weekly, 4: Biweekly, 5: Monthly, 6: Quarterly, 7: Semiannually, 8: Yearly',
    required: false,
  })
  @IsEnum(InstallmentIntervalENUM)
  @IsOptional()
  installmentInterval?: number;

  @ApiProperty({ example: '2026-12-15T00:00:00.000Z', description: 'Due date (ISO 8601)', required: false })
  @IsISO8601()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'Loan description', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
