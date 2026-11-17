import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { ClsService } from 'nestjs-cls';

import { CategoryRepository } from '@database/repositories/category.repository.js';
import { CategoryEntity } from '@database/entities/category.entity.js';
import { API_ERROR_CODES } from '@constants';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiException } from '@exceptionsFilters';
import { ApiResponseT, PaginationQueryParamT } from '@types';

import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/index.js';

@Injectable()
export class CategoryService {
  private readonly logger: LoggerService;

  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService,
    private readonly categoryRepository: CategoryRepository,
    logger: LoggerService,
  ) {
    this.logger = logger.child(CategoryService.name);
  }

  async find(queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    this.logger.verbose(`find | Data: ${JSON.stringify(queryParams)}`);
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    const [items, total] = await this.categoryRepository.advanceFinder(queryParams as PaginationQueryParamT<CategoryEntity>, this.clsService);

    return { type: 'pagination', data: { total, items } };
  }

  async create(createCategoryDTO: CreateCategoryDTO): Promise<ApiResponseT> {
    this.logger.verbose(`createCategory | Data: ${JSON.stringify(createCategoryDTO)}`);

    const existingKey = await this.categoryRepository.findOne({ key: createCategoryDTO.key });
    if (existingKey) {
      this.logger.error(`Category with key ${createCategoryDTO.key} already exists`);
      throw new ApiException(API_ERROR_CODES.CATEGORY_KEY_ALREADY_EXISTS);
    }

    const parent = await this.loadParent(createCategoryDTO.parentId);

    const category = this.categoryRepository.create({
      key: createCategoryDTO.key,
      value: createCategoryDTO.value,
      type: createCategoryDTO.type,
      parent,
      description: createCategoryDTO.description,
      isDeleted: 0,
    });

    await this.em.flush();
    this.logger.log(`Category created with ID: ${category.id}`);
    return {
      type: 'object',
      data: this.toResponseData(category),
    };
  }

  async update(updateCategoryDTO: UpdateCategoryDTO): Promise<ApiResponseT> {
    this.logger.verbose(`update | id: ${updateCategoryDTO.id} | Data: ${JSON.stringify(updateCategoryDTO)}`);

    const category = await this.categoryRepository.findOne({ id: updateCategoryDTO.id });
    if (!category) {
      this.logger.error(`Category not found with ID: ${updateCategoryDTO.id}`);
      throw new ApiException(API_ERROR_CODES.CATEGORY_NOT_FOUND);
    }

    const parent = await this.loadParent(updateCategoryDTO.parentId);

    category.value = updateCategoryDTO.value ?? category.value;
    category.type = updateCategoryDTO.type ?? category.type;
    category.parent = parent ?? category.parent;
    category.description = updateCategoryDTO.description ?? category.description;

    await this.em.flush();
    this.logger.log(`Category updated with ID: ${updateCategoryDTO.id}`);
    return {
      type: 'object',
      data: this.toResponseData(category),
    };
  }

  async delete(id: number): Promise<ApiResponseT> {
    this.logger.verbose(`delete | id: ${id}`);

    const category = await this.categoryRepository.findOne({ id });
    if (!category) {
      this.logger.error(`Category not found with ID: ${id}`);
      throw new ApiException(API_ERROR_CODES.CATEGORY_NOT_FOUND);
    }

    category.isDeleted = 1;
    await this.em.flush();
    this.logger.log(`Category deleted with ID: ${id}`);
    return {
      type: 'withoutResponse',
    };
  }

  private async loadParent(parentId?: number): Promise<CategoryEntity | undefined> {
    if (!parentId) return undefined;
    const parent = await this.categoryRepository.findOne({ id: parentId });
    if (!parent) {
      this.logger.error(`Parent category not found with ID: ${parentId}`);
      throw new ApiException(API_ERROR_CODES.CATEGORY_NOT_FOUND);
    }
    return parent;
  }

  private toResponseData(category: CategoryEntity) {
    return {
      id: category.id,
      key: category.key,
      value: category.value,
      type: category.type,
      parentId: category.parent?.id ?? null,
      description: category.description,
    };
  }
}
