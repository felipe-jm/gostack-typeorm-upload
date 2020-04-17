import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Category from './Category';

export type TransactionType = 'income' | 'outcome';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['income', 'outcome'],
    default: 'income',
  })
  type: TransactionType;

  @Column('float')
  value: number;

  @Column()
  category_id: string;

  @ManyToOne(() => Category, category => category.transactions, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('time with time zone')
  created_at: Date;

  @Column('time with time zone')
  updated_at: Date;
}

export default Transaction;
