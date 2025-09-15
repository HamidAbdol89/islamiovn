import { useQuery } from '@tanstack/react-query';
import { hadithApi } from '../api';
import { QUERY_KEYS, CACHE_CONFIG } from '../constants';

export const useHadithDetail = (hadithId: number | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.hadithDetail(hadithId!),
    queryFn: () => hadithApi.getHadithDetail(hadithId!),
    enabled: !!hadithId,
    staleTime: CACHE_CONFIG.hadithDetail.staleTime,
    gcTime: CACHE_CONFIG.hadithDetail.gcTime,
  });
};
