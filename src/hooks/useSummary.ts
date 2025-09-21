import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import { MonthSummaryResponse } from '../types/views';

// Get month summary
export const useMonthSummary = (month: number, year: number) => {
  return useQuery<MonthSummaryResponse>({
    queryKey: ['monthly-summary', month, year],
    queryFn: async () => {
      const response = await apiClient.get(`/summary/monthly?month=${month}&year=${year}`);
      return response.data;
    },
    enabled: !!month && !!year,
  });
};