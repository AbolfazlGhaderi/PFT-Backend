import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiPaginationQueryParams } from '@decorators';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiResponseT } from '@types';

import { DebtService } from './debt.service.js';
import { CreateDebtDTO, UpdateDebtDTO } from './dto/index.js';
import { ApiCreateDebtSwaggerConfig, ApiFindAllDebtSwaggerConfig, ApiUpdateDebtSwaggerConfig } from './swagger/index.js';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @ApiCreateDebtSwaggerConfig()
  @Post()
  async create(@Body() createDebtDTO: CreateDebtDTO): Promise<ApiResponseT> {
    return await this.debtService.create(createDebtDTO);
  }

  @ApiFindAllDebtSwaggerConfig()
  @Get('find')
  @ApiPaginationQueryParams()
  async find(@Query() queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    return await this.debtService.find(queryParams);
  }

  @ApiUpdateDebtSwaggerConfig()
  @Patch()
  async update(@Body() updateDebtDTO: UpdateDebtDTO): Promise<ApiResponseT> {
    return await this.debtService.update(updateDebtDTO);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<ApiResponseT> {
    return await this.debtService.delete(id);
  }
}
