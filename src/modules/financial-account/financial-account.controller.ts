import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiPaginationQueryParams } from '@decorators';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiResponseT } from '@types';

import { FinancialAccountService } from './financial-account.service.js';
import { CreateFinancialAccountDTO, UpdateFinancialAccountDTO } from './dto/index.js';
import { ApiCreateFinancialAccountSwaggerConfig, ApiFindAllFinancialAccountSwaggerConfig, ApiUpdateFinancialAccountSwaggerConfig } from './swagger/index.js';

@Controller('financial-account')
export class FinancialAccountController {
  constructor(private readonly financialAccountService: FinancialAccountService) {}

  @ApiCreateFinancialAccountSwaggerConfig()
  @Post()
  async create(@Body() createFinancialAccountDTO: CreateFinancialAccountDTO): Promise<ApiResponseT> {
    return await this.financialAccountService.create(createFinancialAccountDTO);
  }

  @ApiFindAllFinancialAccountSwaggerConfig()
  @Get('find')
  @ApiPaginationQueryParams()
  async find(@Query() queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    return await this.financialAccountService.find(queryParams);
  }

  @ApiUpdateFinancialAccountSwaggerConfig()
  @Patch()
  async update(@Body() updateFinancialAccountDTO: UpdateFinancialAccountDTO): Promise<ApiResponseT> {
    return await this.financialAccountService.update(updateFinancialAccountDTO);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<ApiResponseT> {
    return await this.financialAccountService.delete(id);
  }
}
