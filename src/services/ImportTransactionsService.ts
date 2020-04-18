import csv from 'csv-parser';
import fs from 'fs';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';
import AppError from '../errors/AppError';

interface Request {
  path: string;
}

interface Row {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ path }: Request): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const transactions: Transaction[] = [];

    fs.createReadStream(path)
      .pipe(
        csv({
          headers: ['title', 'type', 'value', 'category'],
          mapValues: ({ value }) => value.trim(),
          strict: true,
        }),
      )
      .on('data', async ({ title, value, type, category }: Row) => {
        if (type === 'income' || type === 'outcome') {
          const transaction = await createTransactionService.execute({
            title,
            value,
            type,
            category,
          });

          transactions.push(transaction);
        }
      })
      .on('end', () => transactions)
      .on('error', () => {
        throw new AppError('Error trying to read CSV file');
      });

    return transactions;
  }
}

export default ImportTransactionsService;
