import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import type { AverageTicketResponse, DateRangeParams } from '../types/analytics.types';

/**
 * Hook para buscar o ticket médio (valor médio por pedido)
 * Útil para KPIs e métricas de performance
 */
export function useAverageTicket(params?: DateRangeParams) {
  return useQuery<AverageTicketResponse>({
    queryKey: ['analytics', 'average-ticket', params],
    queryFn: () => analyticsService.getAverageTicket(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
