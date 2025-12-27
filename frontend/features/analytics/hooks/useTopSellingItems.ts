import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import type { TopSellingItem, TopSellingParams } from '../types/analytics.types';

/**
 * Hook para buscar os itens mais vendidos
 * Útil para análise de produtos e gerenciamento de estoque
 */
export function useTopSellingItems(params?: TopSellingParams) {
  return useQuery<TopSellingItem[]>({
    queryKey: ['analytics', 'top-selling', params],
    queryFn: () => analyticsService.getTopSellingItems(params),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
