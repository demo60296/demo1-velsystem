export interface ScheduledTransaction {
  id: string;
  type: 1 | 2 | 3; // 1 = Expense, 2 = Income, 3 = Transfer
  amount: number;
  categoryId?: string;
  accountId: string;
  fromAccountId?: string;
  toAccountId?: string;
  paymentModeId?: string;
  fromPaymentModeId?: string;
  toPaymentModeId?: string;
  description: string;
  tags?: string[];
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  earlyReminder: number; // 0 = none, 1-14 = days before
  nextExecutionDate: string;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  account?: {
    id: string;
    name: string;
    type: number;
  };
  toAccount?: {
    id: string;
    name: string;
    type: number;
  };
  fromAccount?: {
    id: string;
    name: string;
    type: number;
  };
  paymentMode?: {
    id: string;
    name: string;
    type: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduledTransactionData {
  type: 1 | 2 | 3;
  amount: number;
  categoryId?: string;
  accountId: string;
  fromAccountId?: string;
  toAccountId?: string;
  paymentModeId?: string;
  fromPaymentModeId?: string;
  toPaymentModeId?: string;
  description: string;
  tags?: string[];
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  earlyReminder: number;
  nextExecutionDate: string;
}

export interface UpdateScheduledTransactionData {
  type?: 1 | 2 | 3;
  amount?: number;
  categoryId?: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  paymentModeId?: string;
  fromPaymentModeId?: string;
  toPaymentModeId?: string;
  description?: string;
  tags?: string[];
  frequency?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  earlyReminder?: number;
  nextExecutionDate?: string;
  isActive?: boolean;
}

export interface PaginatedScheduledTransactions {
  content: ScheduledTransaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const FREQUENCY_OPTIONS = {
  'none': 'Does not repeat',
  'daily': 'Every day',
  'weekly': 'Every week',
  'monthly': 'Every month',
  'yearly': 'Every year'
} as const;

export const EARLY_REMINDER_OPTIONS = [
  { value: 0, label: 'None' },
  { value: 1, label: '1 day before' },
  { value: 2, label: '2 days before' },
  { value: 3, label: '3 days before' },
  { value: 4, label: '4 days before' },
  { value: 5, label: '5 days before' },
  { value: 6, label: '6 days before' },
  { value: 7, label: '7 days before' },
  { value: 8, label: '8 days before' },
  { value: 9, label: '9 days before' },
  { value: 10, label: '10 days before' },
  { value: 11, label: '11 days before' },
  { value: 12, label: '12 days before' },
  { value: 13, label: '13 days before' },
  { value: 14, label: '14 days before' }
] as const;

export const SCHEDULED_TRANSACTION_TYPES = {
  '1': 'Expense',
  '2': 'Income',
  '3': 'Transfer'
} as const;

export type ScheduledTransactionType = keyof typeof SCHEDULED_TRANSACTION_TYPES;
export type FrequencyType = keyof typeof FREQUENCY_OPTIONS;