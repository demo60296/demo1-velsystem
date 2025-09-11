import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../lib/axios';
import { Tags, UpdateTagData, MergeTagData } from '../types/tag';

// Get all tags
export const useTags = () => {
  return useQuery<Tags[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await apiClient.get('/tags/all');
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });
};

// Update tag
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTagData }) => {
      const response = await apiClient.put(`/tags/${id}/update`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      addToast({
        type: 'success',
        title: 'Tag updated',
        message: 'Your tag has been updated successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update tag',
        message: 'Please try again.',
      });
    },
  });
};

// Merge tag
export const useMergeTag = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MergeTagData }) => {
      const response = await apiClient.put(`/tags/${id}/merge?tagId=${data.tagId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      addToast({
        type: 'success',
        title: 'Tag merged',
        message: 'Tags have been merged successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to merge tags',
        message: 'Please try again.',
      });
    },
  });
};

// Delete tag
export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tags/${id}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      addToast({
        type: 'success',
        title: 'Tag deleted',
        message: 'The tag has been deleted successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to delete tag',
        message: 'Please try again.',
      });
    },
  });
};