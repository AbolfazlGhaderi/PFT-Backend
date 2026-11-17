import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ConfigTypeENUM } from '@enums';

export class UpdateConfigDTO {
  @ApiProperty({ example: 1, description: 'Config ID' })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 'MyApp', description: 'Config value', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ example: ConfigTypeENUM.APP, description: '1: App, 2: Company', required: false })
  @IsEnum(ConfigTypeENUM)
  @IsOptional()
  type?: number;

  @ApiProperty({ example: 'Application name', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
