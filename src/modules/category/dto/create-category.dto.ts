import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

import { CategoryTypeENUM } from '@enums';

export class CreateCategoryDTO {
  @ApiProperty({ example: 'FOOD', description: 'Category key' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key!: string;

  @ApiProperty({ example: 'خوراک', description: 'Category value (title)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  value!: string;

  @ApiProperty({ example: CategoryTypeENUM.EXPENSE, description: '1: Income, 2: Expense' })
  @IsEnum(CategoryTypeENUM)
  @IsNotEmpty()
  type!: number;

  @ApiProperty({ example: 1, description: 'Parent category ID (null for top-level)', required: false })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ example: 'Description', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
