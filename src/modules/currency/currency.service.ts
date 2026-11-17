import { Decimal } from 'decimal.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { ClsService } from 'nestjs-cls';

import { CurrencyRepository } from '@database/repositories/currency.repository.js';
import { CurrencyEntity } from '@database/entities/currency.entity.js';
import { API_ERROR_CODES } from '@constants';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiException } from '@exceptionsFilters';
import { ApiResponseT, PaginationQueryParamT } from '@types';

import { CreateCurrencyDTO, UpdateCurrencyDTO } from './dto/index.js';

@Injectable()
export class CurrencyService {
  private readonly logger: LoggerService;

  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService,
    private readonly currencyRepository: CurrencyRepository,
    logger: LoggerService,
  ) {
    this.logger = logger.child(CurrencyService.name);
  }

  async find(queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    this.logger.verbose(`find | Data: ${JSON.stringify(queryParams)}`);
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    const [items, total] = await this.currencyRepository.advanceFinder(queryParams as PaginationQueryParamT<CurrencyEntity>, this.clsService);

    return { type: 'pagination', data: { total, items } };
  }

  async create(createCurrencyDTO: CreateCurrencyDTO): Promise<ApiResponseT> {
    this.logger.verbose(`createCurrency | Data: ${JSON.stringify(createCurrencyDTO)}`);

    const existingCode = await this.currencyRepository.findOne({ code: createCurrencyDTO.code });
    if (existingCode) {
      this.logger.error(`Currency with code ${createCurrencyDTO.code} already exists`);
      throw new ApiException(API_ERROR_CODES.CURRENCY_CODE_ALREADY_EXISTS);
    }

    const currency = this.currencyRepository.create({
      code: createCurrencyDTO.code,
      title: createCurrencyDTO.title,
      symbol: createCurrencyDTO.symbol,
      decimalPlaces: createCurrencyDTO.decimalPlaces !== undefined ? new Decimal(createCurrencyDTO.decimalPlaces).toNumber() : 2,
      description: createCurrencyDTO.description,
      isDeleted: 0,
    });

    await this.em.flush();
    this.logger.log(`Currency created with ID: ${currency.id}`);
    return {
      type: 'object',
      data: this.toResponseData(currency),
    };
  }

  async update(updateCurrencyDTO: UpdateCurrencyDTO): Promise<ApiResponseT> {
    this.logger.verbose(`update | id: ${updateCurrencyDTO.id} | Data: ${JSON.stringify(updateCurrencyDTO)}`);

    const currency = await this.currencyRepository.findOne({ id: updateCurrencyDTO.id });
    if (!currency) {
      this.logger.error(`Currency not found with ID: ${updateCurrencyDTO.id}`);
      throw new ApiException(API_ERROR_CODES.CURRENCY_NOT_FOUND);
    }

    currency.title = updateCurrencyDTO.title ?? currency.title;
    currency.symbol = updateCurrencyDTO.symbol ?? currency.symbol;
    currency.decimalPlaces = updateCurrencyDTO.decimalPlaces !== undefined ? new Decimal(updateCurrencyDTO.decimalPlaces).toNumber() : currency.decimalPlaces;
    currency.description = updateCurrencyDTO.description ?? currency.description;

    await this.em.flush();
    this.logger.log(`Currency updated with ID: ${updateCurrencyDTO.id}`);
    return {
      type: 'object',
      data: this.toResponseData(currency),
    };
  }

  async delete(id: number): Promise<ApiResponseT> {
    this.logger.verbose(`delete | id: ${id}`);

    const currency = await this.currencyRepository.findOne({ id });
    if (!currency) {
      this.logger.error(`Currency not found with ID: ${id}`);
      throw new ApiException(API_ERROR_CODES.CURRENCY_NOT_FOUND);
    }

    currency.isDeleted = 1;
    await this.em.flush();
    this.logger.log(`Currency deleted with ID: ${id}`);
    return {
      type: 'withoutResponse',
    };
  }

  private toResponseData(currency: CurrencyEntity) {
    return {
      id: currency.id,
      code: currency.code,
      title: currency.title,
      symbol: currency.symbol,
      decimalPlaces: currency.decimalPlaces,
      description: currency.description,
    };
  }
}
