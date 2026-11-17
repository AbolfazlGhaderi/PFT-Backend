import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCurrencyDTO {
  @ApiProperty({ example: 'USD', description: 'Currency code (unique, e.g. IRT/USD)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  code!: string;

  @ApiProperty({ example: 'US Dollar', description: 'Currency title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ example: '$', description: 'Currency symbol', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  symbol?: string;

  @ApiProperty({ example: '2', description: 'Decimal places (default 2)', required: false })
  @IsNumberString()
  @IsOptional()
  decimalPlaces?: string;

  @ApiProperty({ example: 'Description', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
