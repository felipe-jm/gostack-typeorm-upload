import fs from 'fs';
import csv from 'csv-parser';

import Transaction from '../models/Transaction';

import CreateManyTransactionsService from './CreateManyTransactionsService';
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
    const createManyTransactionsService = new CreateManyTransactionsService();

    const readStream = fs.createReadStream(path);

    const parser = readStream.pipe(
      csv({
        headers: ['title', 'type', 'value', 'category'],
        mapValues: ({ value }) => value.trim(),
        skipLines: 1,
      }),
    );

    const transactions: Row[] = [];

    parser.on('data', async (transaction: Row) => {
      transactions.push(transaction);
    });

    parser.on('error', () => {
      throw new AppError('Error trying to read CSV file');
    });

    await new Promise(resolve => parser.on('end', resolve));

    const createdTransactions = await createManyTransactionsService.execute(
      transactions,
    );

    return createdTransactions;
  }
}

export default ImportTransactionsService;
