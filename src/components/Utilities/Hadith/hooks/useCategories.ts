import { useQuery } from '@tanstack/react-query';
import { hadithApi } from '../api';
import { QUERY_KEYS, CACHE_CONFIG } from '../constants';

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: hadithApi.getCategories,
    staleTime: CACHE_CONFIG.categories.staleTime,
    gcTime: CACHE_CONFIG.categories.gcTime,
  });
};
