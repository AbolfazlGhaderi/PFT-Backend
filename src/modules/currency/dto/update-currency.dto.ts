import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCurrencyDTO {
  @ApiProperty({ example: 1, description: 'Currency ID' })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 'US Dollar', description: 'Currency title', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @ApiProperty({ example: '$', description: 'Currency symbol', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  symbol?: string;

  @ApiProperty({ example: '2', description: 'Decimal places', required: false })
  @IsNumberString()
  @IsOptional()
  decimalPlaces?: string;

  @ApiProperty({ example: 'Description', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
