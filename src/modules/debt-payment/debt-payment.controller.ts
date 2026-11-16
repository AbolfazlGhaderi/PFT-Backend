import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiPaginationQueryParams } from '@decorators';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiResponseT } from '@types';

import { DebtPaymentService } from './debt-payment.service.js';
import { CreateDebtPaymentDTO, UpdateDebtPaymentDTO } from './dto/index.js';
import { ApiCreateDebtPaymentSwaggerConfig, ApiFindAllDebtPaymentSwaggerConfig, ApiUpdateDebtPaymentSwaggerConfig } from './swagger/index.js';

@Controller('debt-payment')
export class DebtPaymentController {
  constructor(private readonly debtPaymentService: DebtPaymentService) {}

  @ApiCreateDebtPaymentSwaggerConfig()
  @Post()
  async create(@Body() createDebtPaymentDTO: CreateDebtPaymentDTO): Promise<ApiResponseT> {
    return await this.debtPaymentService.create(createDebtPaymentDTO);
  }

  @ApiFindAllDebtPaymentSwaggerConfig()
  @Get('find')
  @ApiPaginationQueryParams()
  async find(@Query() queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    return await this.debtPaymentService.find(queryParams);
  }

  @ApiUpdateDebtPaymentSwaggerConfig()
  @Patch()
  async update(@Body() updateDebtPaymentDTO: UpdateDebtPaymentDTO): Promise<ApiResponseT> {
    return await this.debtPaymentService.update(updateDebtPaymentDTO);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<ApiResponseT> {
    return await this.debtPaymentService.delete(id);
  }
}
