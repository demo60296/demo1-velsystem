import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';

export interface TransactionsByDateResponse {
  totalIncome: number;
  totalExpense: number;
  transactions: {
    content: Array<{
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
    }>;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  };
}

// Get transactions by date
export const useTransactionsByDate = (date: string, page = 0, size = 10) => {
  return useQuery<TransactionsByDateResponse>({
    queryKey: ['transactions', 'by-date', date, page, size],
    queryFn: async () => {
      const response = await apiClient.get(`/transactions/by-date?date=${date}&page=${page}&size=${size}`);
      return response.data.data || {
        totalIncome: 0,
        totalExpense: 0,
        transactions: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: size,
          number: page,
          first: true,
          last: true
        }
      };
    },
    enabled: !!date,
  });
};