import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import FindOrCreateCategoryService from './FindOrCreateCategoryService';
import CheckIfTransactionsAreValid from './CheckIfTransactionsAreValid';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateManyTransactionsService {
  private async createTransaction({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const findOrCreateCategory = new FindOrCreateCategoryService();

    const foundOrCreatedCategory = await findOrCreateCategory.execute({
      title: category,
    });

    const { id: category_id } = foundOrCreatedCategory;

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    return transaction;
  }

  public async execute(requestArray: Request[]): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const checkIfTransactionsAreValid = new CheckIfTransactionsAreValid();

    const invalidTransactions = checkIfTransactionsAreValid.execute(
      requestArray,
    );

    if (invalidTransactions) {
      throw new AppError('Invalid CSV. Outcomes sum is greater than Incomes.');
    }

    const transactions: Transaction[] = [];

    for (const transaction of requestArray) {
      const createdTransaction = await this.createTransaction(transaction);
      transactions.push(createdTransaction);
    }

    const transactionsSaved = await transactionsRepository.save(transactions);

    return transactionsSaved;
  }
}

export default CreateManyTransactionsService;
