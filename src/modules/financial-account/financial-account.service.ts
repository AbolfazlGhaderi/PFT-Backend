import { Decimal } from 'decimal.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { ClsService } from 'nestjs-cls';

import { CurrencyRepository, FinancialAccountRepository, UserRepository } from '@database';
import { FinancialAccountEntity } from '@database/entities/financial-account.entity.js';
import { API_ERROR_CODES } from '@constants';
import { PaginationQueryParamsDTO } from '@DTOs';
import { FinancialAccountTypeENUM } from '@enums';
import { ApiException } from '@exceptionsFilters';
import { ApiResponseT, PaginationQueryParamT } from '@types';

import { CreateFinancialAccountDTO, UpdateFinancialAccountDTO } from './dto/index.js';

@Injectable()
export class FinancialAccountService {
  private readonly logger: LoggerService;

  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService,
    private readonly financialAccountRepository: FinancialAccountRepository,
    private readonly userRepository: UserRepository,
    private readonly currencyRepository: CurrencyRepository,
    logger: LoggerService,
  ) {
    this.logger = logger.child(FinancialAccountService.name);
  }

  async find(queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    this.logger.verbose(`find | Data: ${JSON.stringify(queryParams)}`);
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    const [items, total] = await this.financialAccountRepository.advanceFinder(queryParams as PaginationQueryParamT<FinancialAccountEntity>, this.clsService);

    return { type: 'pagination', data: { total, items } };
  }

  async create(createFinancialAccountDTO: CreateFinancialAccountDTO): Promise<ApiResponseT> {
    this.logger.verbose(`createFinancialAccount | Data: ${JSON.stringify(createFinancialAccountDTO)}`);

    const user = await this.userRepository.findOne({ id: createFinancialAccountDTO.userId });
    if (!user) {
      this.logger.error(`User not found with ID: ${createFinancialAccountDTO.userId}`);
      throw new ApiException(API_ERROR_CODES.USER_NOT_FOUND);
    }

    const currency = await this.currencyRepository.findOne({ id: createFinancialAccountDTO.currencyId });
    if (!currency) {
      this.logger.error(`Currency not found with ID: ${createFinancialAccountDTO.currencyId}`);
      throw new ApiException(API_ERROR_CODES.CURRENCY_NOT_FOUND);
    }

    const existingTitle = await this.financialAccountRepository.findOne({ user: createFinancialAccountDTO.userId, title: createFinancialAccountDTO.title });
    if (existingTitle) {
      this.logger.error(`Financial account with title ${createFinancialAccountDTO.title} already exists for user ${createFinancialAccountDTO.userId}`);
      throw new ApiException(API_ERROR_CODES.FINANCIAL_ACCOUNT_TITLE_ALREADY_EXISTS);
    }

    const financialAccount = this.financialAccountRepository.create({
      user,
      currency,
      title: createFinancialAccountDTO.title,
      type: createFinancialAccountDTO.type ?? FinancialAccountTypeENUM.BANK,
      initialBalance: new Decimal(createFinancialAccountDTO.initialBalance ?? '0'),
      currentBalance: new Decimal(createFinancialAccountDTO.initialBalance ?? '0'),
      description: createFinancialAccountDTO.description,
      isActive: createFinancialAccountDTO.isActive ?? 1,
      isDeleted: 0,
    });

    await this.em.flush();
    this.logger.log(`Financial account created with ID: ${financialAccount.id}`);
    return {
      type: 'object',
      data: {
        id: financialAccount.id,
        userId: financialAccount.user.id,
        currencyId: financialAccount.currency.id,
        title: financialAccount.title,
        type: financialAccount.type,
        initialBalance: financialAccount.initialBalance,
        currentBalance: financialAccount.currentBalance,
        description: financialAccount.description,
        isActive: financialAccount.isActive,
      },
    };
  }

  async update(updateFinancialAccountDTO: UpdateFinancialAccountDTO): Promise<ApiResponseT> {
    this.logger.verbose(`update | id: ${updateFinancialAccountDTO.id} | Data: ${JSON.stringify(updateFinancialAccountDTO)}`);

    const financialAccount = await this.financialAccountRepository.findOne({ id: updateFinancialAccountDTO.id });
    if (!financialAccount) {
      this.logger.error(`Financial account not found with ID: ${updateFinancialAccountDTO.id}`);
      throw new ApiException(API_ERROR_CODES.FINANCIAL_ACCOUNT_NOT_FOUND);
    }

    if (updateFinancialAccountDTO.title && updateFinancialAccountDTO.title !== financialAccount.title) {
      const existingTitle = await this.financialAccountRepository.findOne({ user: financialAccount.user.id, title: updateFinancialAccountDTO.title });
      if (existingTitle) {
        this.logger.error(`Financial account with title ${updateFinancialAccountDTO.title} already exists for user ${financialAccount.user.id}`);
        throw new ApiException(API_ERROR_CODES.FINANCIAL_ACCOUNT_TITLE_ALREADY_EXISTS);
      }
      financialAccount.title = updateFinancialAccountDTO.title;
    }

    if (updateFinancialAccountDTO.currencyId && updateFinancialAccountDTO.currencyId !== financialAccount.currency.id) {
      const currency = await this.currencyRepository.findOne({ id: updateFinancialAccountDTO.currencyId });
      if (!currency) {
        this.logger.error(`Currency not found with ID: ${updateFinancialAccountDTO.currencyId}`);
        throw new ApiException(API_ERROR_CODES.CURRENCY_NOT_FOUND);
      }
      financialAccount.currency = currency;
    }

    financialAccount.type = updateFinancialAccountDTO.type ?? financialAccount.type;
    if (updateFinancialAccountDTO.initialBalance) financialAccount.initialBalance = new Decimal(updateFinancialAccountDTO.initialBalance);
    financialAccount.description = updateFinancialAccountDTO.description ?? financialAccount.description;
    financialAccount.isActive = updateFinancialAccountDTO.isActive ?? financialAccount.isActive;

    await this.em.flush();
    this.logger.log(`Financial account updated with ID: ${updateFinancialAccountDTO.id}`);
    return {
      type: 'object',
      data: {
        id: financialAccount.id,
        userId: financialAccount.user.id,
        currencyId: financialAccount.currency.id,
        title: financialAccount.title,
        type: financialAccount.type,
        initialBalance: financialAccount.initialBalance,
        currentBalance: financialAccount.currentBalance,
        description: financialAccount.description,
        isActive: financialAccount.isActive,
      },
    };
  }

  async delete(id: number): Promise<ApiResponseT> {
    this.logger.verbose(`delete | id: ${id}`);

    const financialAccount = await this.financialAccountRepository.findOne({ id });
    if (!financialAccount) {
      this.logger.error(`Financial account not found with ID: ${id}`);
      throw new ApiException(API_ERROR_CODES.FINANCIAL_ACCOUNT_NOT_FOUND);
    }

    financialAccount.isDeleted = 1;
    await this.em.flush();
    this.logger.log(`Financial account deleted with ID: ${id}`);
    return {
      type: 'withoutResponse',
    };
  }
}
