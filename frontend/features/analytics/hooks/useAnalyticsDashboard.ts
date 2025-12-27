import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import type { DashboardResponse, DateRangeParams } from '../types/analytics.types';

/**
 * Hook para buscar estatísticas gerais do dashboard
 * Inclui: receita total, pedidos, ticket médio, receita diária, distribuição de status
 */
export function useAnalyticsDashboard(params?: DateRangeParams) {
  return useQuery<DashboardResponse>({
    queryKey: ['analytics', 'dashboard', params],
    queryFn: () => analyticsService.getDashboard(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 60 * 5, // Auto-refresh a cada 5 minutos
  });
}
