import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiPaginationQueryParams } from '@decorators';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiResponseT } from '@types';

import { TransactionService } from './transaction.service.js';
import { CreateTransactionDTO, UpdateTransactionDTO } from './dto/index.js';
import { ApiCreateTransactionSwaggerConfig, ApiFindAllTransactionSwaggerConfig, ApiUpdateTransactionSwaggerConfig } from './swagger/index.js';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiCreateTransactionSwaggerConfig()
  @Post()
  async create(@Body() createTransactionDTO: CreateTransactionDTO): Promise<ApiResponseT> {
    return await this.transactionService.create(createTransactionDTO);
  }

  @ApiFindAllTransactionSwaggerConfig()
  @Get('find')
  @ApiPaginationQueryParams()
  async find(@Query() queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    return await this.transactionService.find(queryParams);
  }

  @ApiUpdateTransactionSwaggerConfig()
  @Patch()
  async update(@Body() updateTransactionDTO: UpdateTransactionDTO): Promise<ApiResponseT> {
    return await this.transactionService.update(updateTransactionDTO);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<ApiResponseT> {
    return await this.transactionService.delete(id);
  }
}
