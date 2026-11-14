import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

import { FinancialAccountTypeENUM } from '@enums';

export class CreateFinancialAccountDTO {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  @IsNumber()
  @IsNotEmpty()
  currencyId!: number;

  @ApiProperty({ example: 'My Bank Account', description: 'Account title (unique per user)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ example: FinancialAccountTypeENUM.BANK, description: '0: Bank, 1: Cash, 2: Wallet, 3: Investment', required: false })
  @IsEnum(FinancialAccountTypeENUM)
  @IsOptional()
  type?: number;

  @ApiProperty({ example: '1000.50', description: 'Initial balance (decimal as string)', required: false })
  @IsNumberString()
  @IsOptional()
  initialBalance?: string;

  @ApiProperty({ example: 'Account description', description: 'Account description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: '0: inactive, 1: active', required: false })
  @IsIn([0, 1])
  @IsOptional()
  isActive?: number;
}
