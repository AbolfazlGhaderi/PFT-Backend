import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiPaginationQueryParams } from '@decorators';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiResponseT } from '@types';

import { CategoryService } from './category.service.js';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/index.js';
import { ApiCreateCategorySwaggerConfig, ApiFindAllCategorySwaggerConfig, ApiUpdateCategorySwaggerConfig } from './swagger/index.js';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreateCategorySwaggerConfig()
  @Post()
  async create(@Body() createCategoryDTO: CreateCategoryDTO): Promise<ApiResponseT> {
    return await this.categoryService.create(createCategoryDTO);
  }

  @ApiFindAllCategorySwaggerConfig()
  @Get('find')
  @ApiPaginationQueryParams()
  async find(@Query() queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    return await this.categoryService.find(queryParams);
  }

  @ApiUpdateCategorySwaggerConfig()
  @Patch()
  async update(@Body() updateCategoryDTO: UpdateCategoryDTO): Promise<ApiResponseT> {
    return await this.categoryService.update(updateCategoryDTO);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<ApiResponseT> {
    return await this.categoryService.delete(id);
  }
}
