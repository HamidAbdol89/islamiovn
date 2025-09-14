import { useQuery } from '@tanstack/react-query';
import { hadithApi } from '../api';
import { QUERY_KEYS, CACHE_CONFIG } from '../constants';

export const useHadiths = (categoryId: number | null, page: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.hadiths(categoryId!, page),
    queryFn: () => hadithApi.getHadiths(categoryId!, page),
    enabled: !!categoryId,
    staleTime: CACHE_CONFIG.hadiths.staleTime,
    gcTime: CACHE_CONFIG.hadiths.gcTime,
  });
};
