import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { 
  ScheduledTransaction, 
  CreateScheduledTransactionData, 
  UpdateScheduledTransactionData,
  PaginatedScheduledTransactions
} from '../types/scheduledTransaction';

// Temporary mock data for development
const mockScheduledTransactions: ScheduledTransaction[] = [
  {
    id: '1',
    type: 1,
    amount: 50.00,
    categoryId: 'cat1',
    accountId: 'acc1',
    description: 'Netflix Subscription',
    tags: ['entertainment', 'subscription'],
    frequency: 'monthly',
    earlyReminder: 1,
    nextExecutionDate: '2025-02-01',
    isActive: true,
    category: {
      id: 'cat1',
      name: 'Entertainment',
      icon: 'tv',
      color: 'purple'
    },
    account: {
      id: 'acc1',
      name: 'Main Bank Account',
      type: 1
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    type: 2,
    amount: 3000.00,
    categoryId: 'cat2',
    accountId: 'acc1',
    description: 'Monthly Salary',
    tags: ['salary', 'income'],
    frequency: 'monthly',
    earlyReminder: 0,
    nextExecutionDate: '2025-01-30',
    isActive: false,
    category: {
      id: 'cat2',
      name: 'Salary',
      icon: 'briefcase',
      color: 'green'
    },
    account: {
      id: 'acc1',
      name: 'Main Bank Account',
      type: 1
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  }
];

// Get upcoming scheduled transactions
export const useUpcomingScheduledTransactions = (page = 0, size = 10) => {
  return useQuery<PaginatedScheduledTransactions>({
    queryKey: ['scheduled-transactions', 'upcoming', page, size],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const upcoming = mockScheduledTransactions.filter(t => t.isActive);
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedContent = upcoming.slice(startIndex, endIndex);
      
      return {
        content: paginatedContent,
        totalElements: upcoming.length,
        totalPages: Math.ceil(upcoming.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: endIndex >= upcoming.length
      };
    },
  });
};

// Get completed scheduled transactions
export const useCompletedScheduledTransactions = (page = 0, size = 10) => {
  console.log('useCompletedScheduledTransactions', page, size);
  return useQuery<PaginatedScheduledTransactions>({
    queryKey: ['scheduled-transactions', 'completed', page, size],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const completed = mockScheduledTransactions.filter(t => !t.isActive);
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedContent = completed.slice(startIndex, endIndex);
      
      return {
        content: paginatedContent,
        totalElements: completed.length,
        totalPages: Math.ceil(completed.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: endIndex >= completed.length
      };
    },
  });
};

// Get all scheduled transactions
export const useScheduledTransactions = (page = 0, size = 10) => {
  return useQuery<PaginatedScheduledTransactions>({
    queryKey: ['scheduled-transactions', 'all', page, size],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedContent = mockScheduledTransactions.slice(startIndex, endIndex);
      
      return {
        content: paginatedContent,
        totalElements: mockScheduledTransactions.length,
        totalPages: Math.ceil(mockScheduledTransactions.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: endIndex >= mockScheduledTransactions.length
      };
    },
  });
};

// Get scheduled transaction by ID
export const useScheduledTransaction = (id: string) => {
  return useQuery<ScheduledTransaction>({
    queryKey: ['scheduled-transaction', id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const transaction = mockScheduledTransactions.find(t => t.id === id);
      if (!transaction) {
        throw new Error('Scheduled transaction not found');
      }
      return transaction;
    },
    enabled: !!id,
  });
};

// Create scheduled transaction
export const useCreateScheduledTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateScheduledTransactionData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTransaction: ScheduledTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockScheduledTransactions.push(newTransaction);
      return { data: newTransaction };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-transactions'] });
      addToast({
        type: 'success',
        title: 'Scheduled transaction created',
        message: 'Your scheduled transaction has been created successfully.',
      });
      navigate('/scheduled');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to create scheduled transaction',
        message: 'Please try again.',
      });
    },
  });
};

// Update scheduled transaction
export const useUpdateScheduledTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateScheduledTransactionData }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = mockScheduledTransactions.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Scheduled transaction not found');
      }
      
      mockScheduledTransactions[index] = {
        ...mockScheduledTransactions[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return { data: mockScheduledTransactions[index] };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-transactions'] });
      addToast({
        type: 'success',
        title: 'Scheduled transaction updated',
        message: 'Your scheduled transaction has been updated successfully.',
      });
      navigate('/scheduled');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update scheduled transaction',
        message: 'Please try again.',
      });
    },
  });
};

// Delete scheduled transaction
export const useDeleteScheduledTransaction = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockScheduledTransactions.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Scheduled transaction not found');
      }
      
      mockScheduledTransactions.splice(index, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-transactions'] });
      addToast({
        type: 'success',
        title: 'Scheduled transaction deleted',
        message: 'The scheduled transaction has been deleted successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to delete scheduled transaction',
        message: 'Please try again.',
      });
    },
  });
};

// Toggle scheduled transaction active status
export const useToggleScheduledTransaction = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockScheduledTransactions.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Scheduled transaction not found');
      }
      
      mockScheduledTransactions[index].isActive = !mockScheduledTransactions[index].isActive;
      mockScheduledTransactions[index].updatedAt = new Date().toISOString();
      
      return { data: mockScheduledTransactions[index] };
    },
    onSuccess: (_, id) => {
      const transaction = mockScheduledTransactions.find(t => t.id === id);
      queryClient.invalidateQueries({ queryKey: ['scheduled-transactions'] });
      addToast({
        type: 'success',
        title: `Scheduled transaction ${transaction?.isActive ? 'activated' : 'deactivated'}`,
        message: `The scheduled transaction has been ${transaction?.isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update scheduled transaction',
        message: 'Please try again.',
      });
    },
  });
};