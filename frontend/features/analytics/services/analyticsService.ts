import { api } from '@/lib/api';
import type {
  AverageTicketResponse,
  TopSellingItem,
  SalesByHourResponse,
  DashboardResponse,
  PeriodComparisonResponse,
  DateRangeParams,
  TopSellingParams,
  SalesByHourParams,
} from '../types/analytics.types';

/**
 * Service para chamadas à API de Analytics
 * Encapsula todas as requisições HTTP para o AnalyticsController
 */
class AnalyticsService {
  private readonly basePath = '/api/analytics';

  /**
   * Retorna estatísticas gerais do dashboard
   * GET /api/analytics/dashboard
   */
  async getDashboard(params?: DateRangeParams): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(`${this.basePath}/dashboard`, {
      params,
    });
    return response.data;
  }

  /**
   * Retorna o ticket médio (valor médio por pedido)
   * GET /api/analytics/average-ticket
   */
  async getAverageTicket(params?: DateRangeParams): Promise<AverageTicketResponse> {
    const response = await api.get<AverageTicketResponse>(`${this.basePath}/average-ticket`, {
      params,
    });
    return response.data;
  }

  /**
   * Retorna os itens mais vendidos
   * GET /api/analytics/top-selling-items
   */
  async getTopSellingItems(params?: TopSellingParams): Promise<TopSellingItem[]> {
    const response = await api.get<TopSellingItem[]>(`${this.basePath}/top-selling-items`, {
      params,
    });
    return response.data;
  }

  /**
   * Retorna o volume de vendas por hora (horários de pico)
   * GET /api/analytics/sales-by-hour
   */
  async getSalesByHour(params?: SalesByHourParams): Promise<SalesByHourResponse> {
    const response = await api.get<SalesByHourResponse>(`${this.basePath}/sales-by-hour`, {
      params,
    });
    return response.data;
  }

  /**
   * Retorna dados para comparação de períodos (hoje vs ontem, esta semana vs última, etc)
   * GET /api/analytics/comparison
   */
  async getPeriodComparison(): Promise<PeriodComparisonResponse> {
    const response = await api.get<PeriodComparisonResponse>(`${this.basePath}/comparison`);
    return response.data;
  }
}

// Exportar instância única do serviço
export const analyticsService = new AnalyticsService();
