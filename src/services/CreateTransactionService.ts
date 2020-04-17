import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import FindOrCreateCategoryService from './FindOrCreateCategoryService';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionsRepository.getBalance();

    const outcomeGreaterThanTotal = type === 'outcome' && value > total;

    if (outcomeGreaterThanTotal) {
      throw new AppError('Outcome greater than total.');
    }

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

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
