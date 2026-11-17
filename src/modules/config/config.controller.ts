import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiPaginationQueryParams } from '@decorators';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiResponseT } from '@types';

import { ConfigService } from './config.service.js';
import { CreateConfigDTO, UpdateConfigDTO } from './dto/index.js';
import { ApiCreateConfigSwaggerConfig, ApiFindAllConfigSwaggerConfig, ApiUpdateConfigSwaggerConfig } from './swagger/index.js';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @ApiCreateConfigSwaggerConfig()
  @Post()
  async create(@Body() createConfigDTO: CreateConfigDTO): Promise<ApiResponseT> {
    return await this.configService.create(createConfigDTO);
  }

  @ApiFindAllConfigSwaggerConfig()
  @Get('find')
  @ApiPaginationQueryParams()
  async find(@Query() queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    return await this.configService.find(queryParams);
  }

  @ApiUpdateConfigSwaggerConfig()
  @Patch()
  async update(@Body() updateConfigDTO: UpdateConfigDTO): Promise<ApiResponseT> {
    return await this.configService.update(updateConfigDTO);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<ApiResponseT> {
    return await this.configService.delete(id);
  }
}
