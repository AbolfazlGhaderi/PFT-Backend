import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

import { CategoryTypeENUM } from '@enums';

export class UpdateCategoryDTO {
  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 'خوراک', description: 'Category value (title)', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  value?: string;

  @ApiProperty({ example: CategoryTypeENUM.EXPENSE, description: '1: Income, 2: Expense', required: false })
  @IsEnum(CategoryTypeENUM)
  @IsOptional()
  type?: number;

  @ApiProperty({ example: 1, description: 'Parent category ID', required: false })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ example: 'Description', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
