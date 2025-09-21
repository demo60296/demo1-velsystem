import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';

export interface RecentTransaction {
  id: string;
  txnDate: string;
  txnTime: string;
  amount: number;
  type: number;
  description: string;
  category?: {
    id: string;
    name: string;
    type: number;
    color: string;
    icon: string;
    deletable: boolean;
  };
  account?: {
    id: string;
    name: string;
    type: number;
    default: boolean;
  };
  fromAccount?: {
    id: string;
    name: string;
    type: number;
    default: boolean;
  };
  toAccount?: {
    id: string;
    name: string;
    type: number;
    default: boolean;
  };
  paymentMode?: {
    id: string;
    name: string;
    type: number;
  } | null;
  fromPaymentMode?: {
    id: string;
    name: string;
    type: number;
  } | null;
  toPaymentMode?: {
    id: string;
    name: string;
    type: number;
  } | null;
  debt?: {
    id: string;
    personName: string;
    dueDate: string;
    amount: number | null;
    additionalDetail: string;
    type: number;
  };
  tags?: {
    id: string;
    name: string;
  }[];
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
}

// Get recent transactions
export const useRecentTransactions = () => {
  return useQuery<RecentTransaction[]>({
    queryKey: ['transactions', 'recent'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions/recent');
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });
};

// Get transaction summary by range
export const useTransactionSummary = (rangeCode: 1 | 2 | 3) => {
  return useQuery<TransactionSummary>({
    queryKey: ['transactions', 'summary', rangeCode],
    queryFn: async () => {
      const response = await apiClient.get(`/transactions/summary?rangeCode=${rangeCode}`);
      return response.data.data || { totalIncome: 0, totalExpense: 0 };
    },
  });
};