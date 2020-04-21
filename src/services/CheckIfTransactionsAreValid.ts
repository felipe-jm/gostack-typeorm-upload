interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CheckIfTransactionsAreValid {
  public execute(transactions: Request[]): boolean {
    const outcomesSum = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((accumulator, { value }) => Number(value) + accumulator, 0);

    const incomesSum = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((accumulator, { value }) => Number(value) + accumulator, 0);

    if (outcomesSum > incomesSum) {
      return true;
    }

    return false;
  }
}

export default CheckIfTransactionsAreValid;
