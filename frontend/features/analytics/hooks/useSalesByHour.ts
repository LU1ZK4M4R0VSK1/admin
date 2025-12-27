import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import type { SalesByHourResponse, SalesByHourParams } from '../types/analytics.types';

/**
 * Hook para buscar vendas por hora do dia
 * Útil para identificar horários de pico e planejar recursos
 */
export function useSalesByHour(params?: SalesByHourParams) {
  return useQuery<SalesByHourResponse>({
    queryKey: ['analytics', 'sales-by-hour', params],
    queryFn: () => analyticsService.getSalesByHour(params),
    staleTime: 1000 * 60 * 15, // 15 minutos
  });
}
