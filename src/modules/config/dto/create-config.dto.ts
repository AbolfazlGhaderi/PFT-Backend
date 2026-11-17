import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { ConfigTypeENUM } from '@enums';

export class CreateConfigDTO {
  @ApiProperty({ example: 'APP_NAME', description: 'Config key (unique)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key!: string;

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
