import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Params {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Params): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found', 400);
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
