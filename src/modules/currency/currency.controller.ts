import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiPaginationQueryParams } from '@decorators';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiResponseT } from '@types';

import { CurrencyService } from './currency.service.js';
import { CreateCurrencyDTO, UpdateCurrencyDTO } from './dto/index.js';
import { ApiCreateCurrencySwaggerConfig, ApiFindAllCurrencySwaggerConfig, ApiUpdateCurrencySwaggerConfig } from './swagger/index.js';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiCreateCurrencySwaggerConfig()
  @Post()
  async create(@Body() createCurrencyDTO: CreateCurrencyDTO): Promise<ApiResponseT> {
    return await this.currencyService.create(createCurrencyDTO);
  }

  @ApiFindAllCurrencySwaggerConfig()
  @Get('find')
  @ApiPaginationQueryParams()
  async find(@Query() queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    return await this.currencyService.find(queryParams);
  }

  @ApiUpdateCurrencySwaggerConfig()
  @Patch()
  async update(@Body() updateCurrencyDTO: UpdateCurrencyDTO): Promise<ApiResponseT> {
    return await this.currencyService.update(updateCurrencyDTO);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<ApiResponseT> {
    return await this.currencyService.delete(id);
  }
}
