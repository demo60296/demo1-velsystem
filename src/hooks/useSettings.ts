import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../lib/axios';
import { 
  UserSettings
} from '../types/settings';

// Get user settings
export const useSettings = (enabled = true) => {
  return useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await apiClient.get('/settings');
      return response.data.data;
    },
    enabled
  });
};

// Update time format
export const useUpdateTimeFormat = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (formatCode: number) => {
      const response = await apiClient.patch(`/settings/time-format?formatCode=${formatCode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast({
        type: 'success',
        title: 'Time format updated',
        message: 'Your time format preference has been saved.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update time format',
        message: 'Please try again.',
      });
    },
  });
};

// Update decimal format
export const useUpdateDecimalFormat = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (formatCode: number) => {
      const response = await apiClient.patch(`/settings/number-format?formatCode=${formatCode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast({
        type: 'success',
        title: 'Decimal format updated',
        message: 'Your decimal format preference has been saved.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update decimal format',
        message: 'Please try again.',
      });
    },
  });
};

// Update number format
export const useUpdateNumberFormat = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (formatCode: number) => {
      const response = await apiClient.patch(`/settings/number-format?formatCode=${formatCode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast({
        type: 'success',
        title: 'Number format updated',
        message: 'Your number format preference has been saved.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update number format',
        message: 'Please try again.',
      });
    },
  });
};

// Update currency code
export const useUpdateCurrencyCode = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (currencyCode: string) => {
      const response = await apiClient.patch(`/settings/currency-code?currencyCode=${currencyCode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast({
        type: 'success',
        title: 'Currency updated',
        message: 'Your currency preference has been saved.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update currency',
        message: 'Please try again.',
      });
    },
  });
};

// Update daily reminder
export const useUpdateDailyReminder = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (dailyReminder: boolean) => {
      const response = await apiClient.patch(`/settings/daily-reminder?dailyReminder=${dailyReminder}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      addToast({
        type: 'success',
        title: 'Daily reminder updated',
        message: 'Your daily reminder preference has been saved.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update daily reminder',
        message: 'Please try again.',
      });
    },
  });
};

// Clear all data
export const useClearAllData = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/settings/data');
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      addToast({
        type: 'success',
        title: 'Data cleared',
        message: 'All your data has been cleared successfully.',
      });
      navigate('/dashboard');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to clear data',
        message: 'Please try again.',
      });
    },
  });
};

// Delete account
export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/settings/account');
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      addToast({
        type: 'info',
        title: 'Account deleted',
        message: 'Your account has been deleted successfully.',
      });
      navigate('/signin');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to delete account',
        message: 'Please try again.',
      });
    },
  });
};