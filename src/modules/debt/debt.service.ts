import { Decimal } from 'decimal.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { ClsService } from 'nestjs-cls';

import { DebtRepository } from '@database/repositories/debt.repository.js';
import { UserRepository } from '@database/repositories/user.repository.js';
import { DebtEntity } from '@database/entities/debt.entity.js';
import { API_ERROR_CODES } from '@constants';
import { PaginationQueryParamsDTO } from '@DTOs';
import { DebtStatusENUM, DebtTypeENUM, InstallmentIntervalENUM } from '@enums';
import { ApiException } from '@exceptionsFilters';
import { ApiResponseT, PaginationQueryParamT } from '@types';

import { CreateDebtDTO, UpdateDebtDTO } from './dto/index.js';

@Injectable()
export class DebtService {
  private readonly logger: LoggerService;

  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService,
    private readonly debtRepository: DebtRepository,
    private readonly userRepository: UserRepository,
    logger: LoggerService,
  ) {
    this.logger = logger.child(DebtService.name);
  }

  async find(queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    this.logger.verbose(`find | Data: ${JSON.stringify(queryParams)}`);
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    const [items, total] = await this.debtRepository.advanceFinder(queryParams as PaginationQueryParamT<DebtEntity>, this.clsService);

    return { type: 'pagination', data: { total, items } };
  }

  async create(createDebtDTO: CreateDebtDTO): Promise<ApiResponseT> {
    this.logger.verbose(`createDebt | Data: ${JSON.stringify(createDebtDTO)}`);

    const user = await this.userRepository.findOne({ id: createDebtDTO.userId });
    if (!user) {
      this.logger.error(`User not found with ID: ${createDebtDTO.userId}`);
      throw new ApiException(API_ERROR_CODES.USER_NOT_FOUND);
    }

    const totalAmount = new Decimal(createDebtDTO.totalAmount);
    const initialPayment = new Decimal(createDebtDTO.initialPayment ?? '0');
    this.validateAmounts(totalAmount, initialPayment);

    const debt = this.debtRepository.create({
      user: createDebtDTO.userId,
      title: createDebtDTO.title,
      startDate: createDebtDTO.startDate ? new Date(createDebtDTO.startDate) : new Date(),
      status: createDebtDTO.status ?? DebtStatusENUM.ACTIVE,
      debtType: createDebtDTO.debtType ?? DebtTypeENUM.PERSONAL,
      totalAmount,
      initialPayment,
      installmentAmount: createDebtDTO.installmentAmount ? new Decimal(createDebtDTO.installmentAmount) : undefined,
      totalInstallments: createDebtDTO.totalInstallments,
      installmentInterval: createDebtDTO.installmentInterval ?? InstallmentIntervalENUM.ONE_TIME,
      dueDate: createDebtDTO.dueDate ? new Date(createDebtDTO.dueDate) : undefined,
      nextPaymentDate: createDebtDTO.nextPaymentDate ? new Date(createDebtDTO.nextPaymentDate) : undefined,
      description: createDebtDTO.description,
      isDeleted: 0,
    });

    await this.em.flush();
    this.logger.log(`Debt created with ID: ${debt.id}`);
    return {
      type: 'object',
      data: this.toResponseData(debt),
    };
  }

  async update(updateDebtDTO: UpdateDebtDTO): Promise<ApiResponseT> {
    this.logger.verbose(`update | id: ${updateDebtDTO.id} | Data: ${JSON.stringify(updateDebtDTO)}`);

    const debt = await this.debtRepository.findOne({ id: updateDebtDTO.id });
    if (!debt) {
      this.logger.error(`Debt not found with ID: ${updateDebtDTO.id}`);
      throw new ApiException(API_ERROR_CODES.DEBT_NOT_FOUND);
    }

    const totalAmount = updateDebtDTO.totalAmount !== undefined ? new Decimal(updateDebtDTO.totalAmount) : debt.totalAmount;
    const initialPayment = updateDebtDTO.initialPayment !== undefined ? new Decimal(updateDebtDTO.initialPayment) : debt.initialPayment;
    this.validateAmounts(totalAmount, initialPayment);

    debt.title = updateDebtDTO.title ?? debt.title;
    if (updateDebtDTO.startDate) debt.startDate = new Date(updateDebtDTO.startDate);
    debt.status = updateDebtDTO.status ?? debt.status;
    debt.debtType = updateDebtDTO.debtType ?? debt.debtType;
    debt.totalAmount = totalAmount;
    debt.initialPayment = initialPayment;
    if (updateDebtDTO.installmentAmount) debt.installmentAmount = new Decimal(updateDebtDTO.installmentAmount);
    debt.totalInstallments = updateDebtDTO.totalInstallments ?? debt.totalInstallments;
    debt.installmentInterval = updateDebtDTO.installmentInterval ?? debt.installmentInterval;
    if (updateDebtDTO.dueDate) debt.dueDate = new Date(updateDebtDTO.dueDate);
    if (updateDebtDTO.nextPaymentDate) debt.nextPaymentDate = new Date(updateDebtDTO.nextPaymentDate);
    debt.description = updateDebtDTO.description ?? debt.description;

    await this.em.flush();
    this.logger.log(`Debt updated with ID: ${updateDebtDTO.id}`);
    return {
      type: 'object',
      data: this.toResponseData(debt),
    };
  }

  async delete(id: number): Promise<ApiResponseT> {
    this.logger.verbose(`delete | id: ${id}`);

    const debt = await this.debtRepository.findOne({ id });
    if (!debt) {
      this.logger.error(`Debt not found with ID: ${id}`);
      throw new ApiException(API_ERROR_CODES.DEBT_NOT_FOUND);
    }

    debt.isDeleted = 1;
    await this.em.flush();
    this.logger.log(`Debt deleted with ID: ${id}`);
    return {
      type: 'withoutResponse',
    };
  }

  private validateAmounts(totalAmount: Decimal, initialPayment: Decimal): void {
    if (totalAmount.lte(0) || initialPayment.isNegative() || initialPayment.gt(totalAmount)) throw new ApiException(API_ERROR_CODES.INVALID_DEBT_AMOUNT);
  }

  private toResponseData(debt: DebtEntity) {
    return {
      id: debt.id,
      userId: debt.user.id,
      title: debt.title,
      startDate: debt.startDate,
      status: debt.status,
      debtType: debt.debtType,
      totalAmount: debt.totalAmount,
      initialPayment: debt.initialPayment,
      installmentAmount: debt.installmentAmount,
      totalInstallments: debt.totalInstallments,
      installmentInterval: debt.installmentInterval,
      dueDate: debt.dueDate,
      nextPaymentDate: debt.nextPaymentDate,
      description: debt.description,
    };
  }
}
