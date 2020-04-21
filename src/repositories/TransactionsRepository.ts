import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const outcomesSum = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((accumulator, { value }) => Number(value) + accumulator, 0);

    const incomesSum = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((accumulator, { value }) => Number(value) + accumulator, 0);

    const balance = {
      income: incomesSum,
      outcome: outcomesSum,
      total: incomesSum - outcomesSum,
    };

    return balance;
  }
}

export default TransactionsRepository;
