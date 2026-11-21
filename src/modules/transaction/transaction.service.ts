import { Decimal } from 'decimal.js';
import { EntityManager, LockMode } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'logger-nestjs';
import { ClsService } from 'nestjs-cls';

import { CategoryEntity } from '@database/entities/category.entity.js';
import { DebtPaymentEntity } from '@database/entities/debt-payment.entity.js';
import { FinancialAccountEntity } from '@database/entities/financial-account.entity.js';
import { TransactionEntity } from '@database/entities/transaction.entity.js';
import { TransactionRepository } from '@database/repositories/transaction.repository.js';
import { API_ERROR_CODES } from '@constants';
import { PaginationQueryParamsDTO } from '@DTOs';
import { PaymentMethodENUM, TransactionTypeENUM } from '@enums';
import { ApiException } from '@exceptionsFilters';
import { ApiResponseT, PaginationQueryParamT } from '@types';

import { CreateTransactionDTO, UpdateTransactionDTO } from './dto/index.js';

@Injectable()
export class TransactionService {
  private readonly logger: LoggerService;

  constructor(
    private readonly em: EntityManager,
    private readonly clsService: ClsService,
    private readonly transactionRepository: TransactionRepository,
    logger: LoggerService,
  ) {
    this.logger = logger.child(TransactionService.name);
  }

  async find(queryParams: PaginationQueryParamsDTO): Promise<ApiResponseT> {
    this.logger.verbose(`find | Data: ${JSON.stringify(queryParams)}`);
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    const [items, total] = await this.transactionRepository.advanceFinder(queryParams as PaginationQueryParamT<TransactionEntity>, this.clsService);

    return { type: 'pagination', data: { total, items } };
  }

  async create(createTransactionDTO: CreateTransactionDTO): Promise<ApiResponseT> {
    this.logger.verbose(`createTransaction | Data: ${JSON.stringify(createTransactionDTO)}`);

    const amount = new Decimal(createTransactionDTO.amount);
    const fee = new Decimal(createTransactionDTO.fee ?? '0');
    const discountAmount = new Decimal(createTransactionDTO.discountAmount ?? '0');
    this.validateAmounts(amount, fee, discountAmount);
    const totalAmount = amount.plus(fee).minus(discountAmount);

    // mirror the DB CHECK constraint with readable errors
    this.validateTypeAndToAccount(createTransactionDTO.type, createTransactionDTO.accountId, createTransactionDTO.toAccountId);

    const transaction = await this.em.transactional(async tem => {
      let category: CategoryEntity | undefined;
      if (createTransactionDTO.categoryId) {
        category = (await tem.findOne(CategoryEntity, { id: createTransactionDTO.categoryId })) ?? undefined;
        if (!category) {
          this.logger.error(`Category not found with ID: ${createTransactionDTO.categoryId}`);
          throw new ApiException(API_ERROR_CODES.CATEGORY_NOT_FOUND);
        }
      }

      const account = await this.lockAccount(tem, createTransactionDTO.accountId);
      let toAccount: FinancialAccountEntity | undefined;
      if (createTransactionDTO.toAccountId) {
        toAccount = await this.lockAccount(tem, createTransactionDTO.toAccountId);
        this.validateTransferCurrencies(createTransactionDTO.type, account, toAccount);
      }

      const transaction = tem.create(TransactionEntity, {
        title: createTransactionDTO.title,
        account,
        toAccount,
        category,
        type: createTransactionDTO.type,
        amount,
        fee,
        discountAmount,
        totalAmount,
        paymentMethod: createTransactionDTO.paymentMethod ?? PaymentMethodENUM.CARD,
        paymentDate: createTransactionDTO.paymentDate ? new Date(createTransactionDTO.paymentDate) : new Date(),
        description: createTransactionDTO.description,
        invoice: createTransactionDTO.invoice,
        isDeleted: 0,
      });

      this.applyBalanceDeltas(createTransactionDTO.type, account, toAccount, amount, totalAmount, 1);
      await tem.flush();
      return transaction;
    });

    this.logger.log(`Transaction created with ID: ${transaction.id}`);
    return {
      type: 'object',
      data: this.toResponseData(transaction),
    };
  }

  async update(updateTransactionDTO: UpdateTransactionDTO): Promise<ApiResponseT> {
    this.logger.verbose(`update | id: ${updateTransactionDTO.id} | Data: ${JSON.stringify(updateTransactionDTO)}`);

    const transaction = await this.em.transactional(async tem => {
      const transaction = await tem.findOne(TransactionEntity, { id: updateTransactionDTO.id });
      if (!transaction) {
        this.logger.error(`Transaction not found with ID: ${updateTransactionDTO.id}`);
        throw new ApiException(API_ERROR_CODES.TRANSACTION_NOT_FOUND);
      }

      // resolve the new values first so the revert/apply runs on final numbers
      const type = updateTransactionDTO.type ?? transaction.type;
      const amount = updateTransactionDTO.amount !== undefined ? new Decimal(updateTransactionDTO.amount) : transaction.amount;
      const fee = updateTransactionDTO.fee !== undefined ? new Decimal(updateTransactionDTO.fee) : transaction.fee;
      const discountAmount = updateTransactionDTO.discountAmount !== undefined ? new Decimal(updateTransactionDTO.discountAmount) : transaction.discountAmount;
      this.validateAmounts(amount, fee, discountAmount);
      const totalAmount = amount.plus(fee).minus(discountAmount);

      const accountId = updateTransactionDTO.accountId ?? transaction.account.id;
      // non-transfer types never keep a toAccount; TRANSFER keeps the old one unless a new one is given
      const toAccountId =
        type === TransactionTypeENUM.TRANSFER
          ? (updateTransactionDTO.toAccountId ?? transaction.toAccount?.id)
          : (updateTransactionDTO.toAccountId ?? undefined);
      this.validateTypeAndToAccount(type, accountId, toAccountId);

      // revert the old balance effect (no funds check: restoring the historical state)
      const oldAccount = await this.lockAccount(tem, transaction.account.id);
      const oldToAccount = transaction.toAccount ? await this.lockAccount(tem, transaction.toAccount.id) : undefined;
      this.applyBalanceDeltas(transaction.type, oldAccount, oldToAccount, transaction.amount, transaction.totalAmount, -1);

      const account =
        updateTransactionDTO.accountId && updateTransactionDTO.accountId !== transaction.account.id ? await this.lockAccount(tem, accountId) : oldAccount;
      let toAccount: FinancialAccountEntity | undefined;
      // TRANSFER without toAccountId is an external transfer: only the source account is touched
      if (type === TransactionTypeENUM.TRANSFER && toAccountId) {
        toAccount = toAccountId !== oldToAccount?.id ? await this.lockAccount(tem, toAccountId) : oldToAccount;
        if (!toAccount) throw new ApiException(API_ERROR_CODES.FINANCIAL_ACCOUNT_NOT_FOUND);
        this.validateTransferCurrencies(type, account, toAccount);
      }

      if (updateTransactionDTO.categoryId !== undefined) {
        const category = (await tem.findOne(CategoryEntity, { id: updateTransactionDTO.categoryId })) ?? undefined;
        if (!category) {
          this.logger.error(`Category not found with ID: ${updateTransactionDTO.categoryId}`);
          throw new ApiException(API_ERROR_CODES.CATEGORY_NOT_FOUND);
        }
        transaction.category = category;
      }

      transaction.type = type;
      transaction.account = account;
      transaction.toAccount = toAccount;
      transaction.amount = amount;
      transaction.fee = fee;
      transaction.discountAmount = discountAmount;
      transaction.totalAmount = totalAmount;
      if (updateTransactionDTO.paymentMethod !== undefined) transaction.paymentMethod = updateTransactionDTO.paymentMethod;
      if (updateTransactionDTO.paymentDate) transaction.paymentDate = new Date(updateTransactionDTO.paymentDate);
      if (updateTransactionDTO.description !== undefined) transaction.description = updateTransactionDTO.description;
      if (updateTransactionDTO.invoice !== undefined) transaction.invoice = updateTransactionDTO.invoice;

      // apply the new balance effect (funds checked)
      this.applyBalanceDeltas(type, account, toAccount, amount, totalAmount, 1);
      await tem.flush();
      return transaction;
    });

    this.logger.log(`Transaction updated with ID: ${updateTransactionDTO.id}`);
    return {
      type: 'object',
      data: this.toResponseData(transaction),
    };
  }

  async delete(id: number): Promise<ApiResponseT> {
    this.logger.verbose(`delete | id: ${id}`);

    await this.em.transactional(async tem => {
      const transaction = await tem.findOne(TransactionEntity, { id });
      if (!transaction) {
        this.logger.error(`Transaction not found with ID: ${id}`);
        throw new ApiException(API_ERROR_CODES.TRANSACTION_NOT_FOUND);
      }

      const debtPayment = await tem.findOne(DebtPaymentEntity, { transaction: id });
      if (debtPayment) {
        this.logger.error(`Cannot delete transaction with ID: ${id} because it is linked to debt payment with ID: ${debtPayment.id}`);
        throw new ApiException(API_ERROR_CODES.TRANSACTION_ATTACHED_TO_DEBT_PAYMENT);
      }

      // revert the balance effect so the deleted transaction no longer counts
      const account = await this.lockAccount(tem, transaction.account.id);
      const toAccount = transaction.toAccount ? await this.lockAccount(tem, transaction.toAccount.id) : undefined;
      this.applyBalanceDeltas(transaction.type, account, toAccount, transaction.amount, transaction.totalAmount, -1);

      transaction.isDeleted = 1;
      await tem.flush();
    });

    this.logger.log(`Transaction deleted with ID: ${id}`);
    return {
      type: 'withoutResponse',
    };
  }

  // [account delta, toAccount delta]; the toAccount delta only exists for TRANSFER
  private balanceDeltas(type: number, amount: Decimal, totalAmount: Decimal): [Decimal, Decimal | null] {
    if (type === TransactionTypeENUM.INCOME) return [totalAmount, null];
    if (type === TransactionTypeENUM.EXPENSE) return [totalAmount.neg(), null];
    return [totalAmount.neg(), amount];
  }

  private applyBalanceDeltas(
    type: number,
    account: FinancialAccountEntity,
    toAccount: FinancialAccountEntity | undefined,
    amount: Decimal,
    totalAmount: Decimal,
    direction: 1 | -1,
  ): void {
    const [accountDelta, toAccountDelta] = this.balanceDeltas(type, amount, totalAmount);

    const accountBalance = account.currentBalance.plus(accountDelta.times(direction));
    // funds are checked only when applying (direction 1); a revert restores the historical state and may go negative
    if (direction === 1 && accountBalance.isNegative()) {
      this.logger.error(`Insufficient funds on account ${account.id}: current ${account.currentBalance.toString()}, required ${accountDelta.toString()}`);
      throw new ApiException(API_ERROR_CODES.INSUFFICIENT_FUNDS);
    }
    account.currentBalance = accountBalance;

    if (toAccountDelta && toAccount) toAccount.currentBalance = toAccount.currentBalance.plus(toAccountDelta.times(direction));
  }

  private validateAmounts(amount: Decimal, fee: Decimal, discountAmount: Decimal): void {
    if (amount.lte(0) || fee.isNegative() || discountAmount.isNegative()) throw new ApiException(API_ERROR_CODES.INVALID_AMOUNT);
  }

  private validateTypeAndToAccount(type: number, accountId: number, toAccountId?: number): void {
    if (type !== TransactionTypeENUM.TRANSFER && toAccountId) throw new ApiException(API_ERROR_CODES.TO_ACCOUNT_NOT_ALLOWED);
    if (toAccountId && toAccountId === accountId) throw new ApiException(API_ERROR_CODES.TRANSFER_ACCOUNTS_IDENTICAL);
  }

  private validateTransferCurrencies(type: number, account: FinancialAccountEntity, toAccount: FinancialAccountEntity): void {
    if (type === TransactionTypeENUM.TRANSFER && toAccount.currency.id !== account.currency.id) throw new ApiException(API_ERROR_CODES.CURRENCY_MISMATCH);
  }

  // SELECT ... FOR UPDATE so concurrent transactions cannot lose balance updates
  private async lockAccount(tem: EntityManager, id: number): Promise<FinancialAccountEntity> {
    const account = await tem.findOne(FinancialAccountEntity, { id }, { lockMode: LockMode.PESSIMISTIC_WRITE });
    if (!account) {
      this.logger.error(`Financial account not found with ID: ${id}`);
      throw new ApiException(API_ERROR_CODES.FINANCIAL_ACCOUNT_NOT_FOUND);
    }
    return account;
  }

  private toResponseData(transaction: TransactionEntity) {
    return {
      id: transaction.id,
      title: transaction.title,
      type: transaction.type,
      accountId: transaction.account.id,
      toAccountId: transaction.toAccount?.id ?? null,
      categoryId: transaction.category?.id ?? null,
      amount: transaction.amount,
      fee: transaction.fee,
      discountAmount: transaction.discountAmount,
      totalAmount: transaction.totalAmount,
      paymentMethod: transaction.paymentMethod,
      paymentDate: transaction.paymentDate,
      description: transaction.description,
      invoice: transaction.invoice,
    };
  }
}
