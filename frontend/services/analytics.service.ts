/**
 * Serviço de API para Analytics
 */

import { apiClient } from './api.client';
import type { 
  TableAnalytics, 
  DashboardMetrics, 
  ProductSales,
  DateRangeDto 
} from '@/types';

export const analyticsService = {
  /**
   * Retorna ticket médio
   */
  async getAverageTicket(dateRange?: DateRangeDto): Promise<{
    averageTicket: number;
    totalOrders: number;
    totalRevenue: number;
    period: { start: string; end: string };
  }> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const query = params.toString();
    return apiClient.get(`/analytics/average-ticket${query ? `?${query}` : ''}`);
  },

  /**
   * Retorna produtos mais vendidos
   */
  async getTopSellingItems(limit: number = 10, dateRange?: DateRangeDto): Promise<ProductSales[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    return apiClient.get(`/analytics/top-selling-items?${params.toString()}`);
  },

  /**
   * Retorna vendas por hora
   */
  async getSalesByHour(date?: string): Promise<Array<{
    hour: number;
    orderCount: number;
    totalRevenue: number;
    averageTicket: number;
  }>> {
    const query = date ? `?date=${date}` : '';
    return apiClient.get(`/analytics/sales-by-hour${query}`);
  },

  /**
   * Retorna métricas do dashboard
   */
  async getDashboard(dateRange?: DateRangeDto): Promise<DashboardMetrics> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const query = params.toString();
    return apiClient.get(`/analytics/dashboard${query ? `?${query}` : ''}`);
  },

  /**
   * Analytics por mesa - útil para segmentação de marketing
   */
  async getTableAnalytics(dateRange?: DateRangeDto): Promise<TableAnalytics[]> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const query = params.toString();
    return apiClient.get(`/analytics/tables${query ? `?${query}` : ''}`);
  },

  /**
   * Receita por localização de mesa
   */
  async getRevenueByLocation(dateRange?: DateRangeDto): Promise<Record<string, number>> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);
    
    const query = params.toString();
    return apiClient.get(`/analytics/revenue-by-location${query ? `?${query}` : ''}`);
  }
};
