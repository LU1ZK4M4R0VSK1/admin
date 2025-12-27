import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import type { PeriodComparisonResponse } from '../types/analytics.types';

/**
 * Hook para buscar comparação entre períodos
 * Compara: hoje vs ontem, esta semana vs última semana, este mês vs último mês
 */
export function usePeriodComparison() {
  return useQuery<PeriodComparisonResponse>({
    queryKey: ['analytics', 'comparison'],
    queryFn: () => analyticsService.getPeriodComparison(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchInterval: 1000 * 60 * 10, // Auto-refresh a cada 10 minutos
  });
}
