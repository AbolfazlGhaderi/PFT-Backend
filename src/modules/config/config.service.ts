import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { ClsService } from 'nestjs-cls';

import { ConfigRepository } from '@database/repositories/config.repository.js';
import { ConfigEntity } from '@database/entities/config.entity.js';
import { API_ERROR_CODES } from '@constants';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ConfigTypeENUM } from '@enums';
import { ApiException } from '@exceptionsFilters';
import { ApiResponseT, PaginationQueryParamT } from '@types';

import { CreateConfigDTO, UpdateConfigDTO } from './dto/index.js';

@Injectable()
export class ConfigService {
  private readonly logger: LoggerService;

  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService,
    private readonly configRepository: ConfigRepository,
    logger: LoggerService,
  ) {
    this.logger = logger.child(ConfigService.name);
  }

  async find(queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    this.logger.verbose(`find | Data: ${JSON.stringify(queryParams)}`);
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    const [items, total] = await this.configRepository.advanceFinder(queryParams as PaginationQueryParamT<ConfigEntity>, this.clsService);

    return { type: 'pagination', data: { total, items } };
  }

  async create(createConfigDTO: CreateConfigDTO): Promise<ApiResponseT> {
    this.logger.verbose(`createConfig | Data: ${JSON.stringify(createConfigDTO)}`);

    const existingKey = await this.configRepository.findOne({ key: createConfigDTO.key });
    if (existingKey) {
      this.logger.error(`Config with key ${createConfigDTO.key} already exists`);
      throw new ApiException(API_ERROR_CODES.CONFIG_KEY_ALREADY_EXISTS);
    }

    const config = this.configRepository.create({
      key: createConfigDTO.key,
      value: createConfigDTO.value,
      type: createConfigDTO.type ?? ConfigTypeENUM.APP,
      description: createConfigDTO.description,
      isDeleted: 0,
    });

    await this.em.flush();
    this.logger.log(`Config created with ID: ${config.id}`);
    return {
      type: 'object',
      data: this.toResponseData(config),
    };
  }

  async update(updateConfigDTO: UpdateConfigDTO): Promise<ApiResponseT> {
    this.logger.verbose(`update | id: ${updateConfigDTO.id} | Data: ${JSON.stringify(updateConfigDTO)}`);

    const config = await this.configRepository.findOne({ id: updateConfigDTO.id });
    if (!config) {
      this.logger.error(`Config not found with ID: ${updateConfigDTO.id}`);
      throw new ApiException(API_ERROR_CODES.CONFIG_NOT_FOUND);
    }

    config.value = updateConfigDTO.value ?? config.value;
    config.type = updateConfigDTO.type ?? config.type;
    config.description = updateConfigDTO.description ?? config.description;

    await this.em.flush();
    this.logger.log(`Config updated with ID: ${updateConfigDTO.id}`);
    return {
      type: 'object',
      data: this.toResponseData(config),
    };
  }

  async delete(id: number): Promise<ApiResponseT> {
    this.logger.verbose(`delete | id: ${id}`);

    const config = await this.configRepository.findOne({ id });
    if (!config) {
      this.logger.error(`Config not found with ID: ${id}`);
      throw new ApiException(API_ERROR_CODES.CONFIG_NOT_FOUND);
    }

    config.isDeleted = 1;
    await this.em.flush();
    this.logger.log(`Config deleted with ID: ${id}`);
    return {
      type: 'withoutResponse',
    };
  }

  private toResponseData(config: ConfigEntity) {
    return {
      id: config.id,
      key: config.key,
      value: config.value,
      type: config.type,
      description: config.description,
    };
  }
}
