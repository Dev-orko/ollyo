import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

/**
 * Generic CRUD hook factory for any entity.
 * @param {string} key - React Query cache key
 * @param {string} endpoint - API endpoint (e.g. '/customers')
 */
export function useCrud(key, endpoint) {
  const queryClient = useQueryClient();

  const useList = (params = {}) => {
    const queryStr = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();

    return useQuery({
      queryKey: [key, params],
      queryFn: () => api.get(`${endpoint}?${queryStr}`).then((r) => r.data),
      keepPreviousData: true,
    });
  };

  const useDetail = (id) =>
    useQuery({
      queryKey: [key, id],
      queryFn: () => api.get(`${endpoint}/${id}`).then((r) => r.data),
      enabled: !!id,
    });

  const useCreate = () =>
    useMutation({
      mutationFn: (data) => api.post(endpoint, data).then((r) => r.data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [key] });
        toast.success(data.message || 'Created successfully');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Create failed');
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: ({ id, data }) => api.put(`${endpoint}/${id}`, data).then((r) => r.data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [key] });
        toast.success(data.message || 'Updated successfully');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Update failed');
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id) => api.delete(`${endpoint}/${id}`).then((r) => r.data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [key] });
        toast.success(data.message || 'Deleted successfully');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Delete failed');
      },
    });

  return { useList, useDetail, useCreate, useUpdate, useDelete };
}
