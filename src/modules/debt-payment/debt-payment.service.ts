import { Decimal } from 'decimal.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { ClsService } from 'nestjs-cls';

import { DebtPaymentRepository } from '@database/repositories/debt-payment.repository.js';
import { DebtRepository } from '@database/repositories/debt.repository.js';
import { TransactionRepository } from '@database/repositories/transaction.repository.js';
import { DebtPaymentEntity } from '@database/entities/debt-payment.entity.js';
import { API_ERROR_CODES } from '@constants';
import { PaginationQueryParamsDTO } from '@DTOs';
import { ApiException } from '@exceptionsFilters';
import { ApiResponseT, PaginationQueryParamT } from '@types';

import { CreateDebtPaymentDTO, UpdateDebtPaymentDTO } from './dto/index.js';

@Injectable()
export class DebtPaymentService {
  private readonly logger: LoggerService;

  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService,
    private readonly debtPaymentRepository: DebtPaymentRepository,
    private readonly debtRepository: DebtRepository,
    private readonly transactionRepository: TransactionRepository,
    logger: LoggerService,
  ) {
    this.logger = logger.child(DebtPaymentService.name);
  }

  async find(queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    this.logger.verbose(`find | Data: ${JSON.stringify(queryParams)}`);
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    const [items, total] = await this.debtPaymentRepository.advanceFinder(queryParams as PaginationQueryParamT<DebtPaymentEntity>, this.clsService);

    return { type: 'pagination', data: { total, items } };
  }

  async create(createDebtPaymentDTO: CreateDebtPaymentDTO): Promise<ApiResponseT> {
    this.logger.verbose(`createDebtPayment | Data: ${JSON.stringify(createDebtPaymentDTO)}`);

    const amount = new Decimal(createDebtPaymentDTO.amount);
    this.validatePayment(createDebtPaymentDTO.installmentNumber, amount);

    const debt = await this.debtRepository.findOne({ id: createDebtPaymentDTO.debtId });
    if (!debt) {
      this.logger.error(`Debt not found with ID: ${createDebtPaymentDTO.debtId}`);
      throw new ApiException(API_ERROR_CODES.DEBT_NOT_FOUND);
    }

    const transaction = await this.transactionRepository.findOne({ id: createDebtPaymentDTO.transactionId });
    if (!transaction) {
      this.logger.error(`Transaction not found with ID: ${createDebtPaymentDTO.transactionId}`);
      throw new ApiException(API_ERROR_CODES.TRANSACTION_NOT_FOUND);
    }

    const debtPayment = this.debtPaymentRepository.create({
      debt,
      transaction,
      installmentNumber: createDebtPaymentDTO.installmentNumber,
      amount,
      paidAt: createDebtPaymentDTO.paidAt ? new Date(createDebtPaymentDTO.paidAt) : new Date(),
      description: createDebtPaymentDTO.description,
      isDeleted: 0,
    });

    await this.em.flush();
    this.logger.log(`Debt payment created with ID: ${debtPayment.id}`);
    return {
      type: 'object',
      data: this.toResponseData(debtPayment),
    };
  }

  async update(updateDebtPaymentDTO: UpdateDebtPaymentDTO): Promise<ApiResponseT> {
    this.logger.verbose(`update | id: ${updateDebtPaymentDTO.id} | Data: ${JSON.stringify(updateDebtPaymentDTO)}`);

    const debtPayment = await this.debtPaymentRepository.findOne({ id: updateDebtPaymentDTO.id });
    if (!debtPayment) {
      this.logger.error(`Debt payment not found with ID: ${updateDebtPaymentDTO.id}`);
      throw new ApiException(API_ERROR_CODES.DEBT_PAYMENT_NOT_FOUND);
    }

    const amount = updateDebtPaymentDTO.amount !== undefined ? new Decimal(updateDebtPaymentDTO.amount) : debtPayment.amount;
    this.validatePayment(updateDebtPaymentDTO.installmentNumber, amount);

    debtPayment.installmentNumber = updateDebtPaymentDTO.installmentNumber ?? debtPayment.installmentNumber;
    debtPayment.amount = amount;
    if (updateDebtPaymentDTO.paidAt) debtPayment.paidAt = new Date(updateDebtPaymentDTO.paidAt);
    debtPayment.description = updateDebtPaymentDTO.description ?? debtPayment.description;

    await this.em.flush();
    this.logger.log(`Debt payment updated with ID: ${updateDebtPaymentDTO.id}`);
    return {
      type: 'object',
      data: this.toResponseData(debtPayment),
    };
  }

  async delete(id: number): Promise<ApiResponseT> {
    this.logger.verbose(`delete | id: ${id}`);

    const debtPayment = await this.debtPaymentRepository.findOne({ id });
    if (!debtPayment) {
      this.logger.error(`Debt payment not found with ID: ${id}`);
      throw new ApiException(API_ERROR_CODES.DEBT_PAYMENT_NOT_FOUND);
    }

    debtPayment.isDeleted = 1;
    await this.em.flush();
    this.logger.log(`Debt payment deleted with ID: ${id}`);
    return {
      type: 'withoutResponse',
    };
  }

  private validatePayment(installmentNumber: number | undefined, amount: Decimal): void {
    if (amount.lte(0) || (installmentNumber !== undefined && installmentNumber <= 0)) throw new ApiException(API_ERROR_CODES.INVALID_DEBT_AMOUNT);
  }

  private toResponseData(debtPayment: DebtPaymentEntity) {
    return {
      id: debtPayment.id,
      debtId: debtPayment.debt.id,
      transactionId: debtPayment.transaction.id,
      installmentNumber: debtPayment.installmentNumber,
      amount: debtPayment.amount,
      paidAt: debtPayment.paidAt,
      description: debtPayment.description,
    };
  }
}
