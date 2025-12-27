/**
 * API Services for backend communication
 * Organized by resource type
 */

import { api } from './api';
import type {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  ChangeOrderStatusDto,
  Table,
  CreateTableDto,
  UpdateTableDto,
  MenuItem,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  DashboardStats,
  RecentOrder,
  TopMenuItem,
  AnalyticsMetrics
} from './types';

// ========== ORDERS API ==========

export const ordersApi = {
  getAll: (params?: { tableId?: number; status?: number; startDate?: string; endDate?: string }) =>
    api.get<Order[]>('/orders', params),
    
  getById: (id: number) =>
    api.get<Order>(`/orders/${id}`),
    
  create: (data: CreateOrderDto) =>
    api.post<Order>('/orders', data),
    
  update: (id: number, data: UpdateOrderDto) =>
    api.put<Order>(`/orders/${id}`, data),
    
  changeStatus: (id: number, data: ChangeOrderStatusDto) =>
    api.put<Order>(`/orders/${id}/status`, data),
    
  delete: (id: number) =>
    api.delete<void>(`/orders/${id}`),
};

// ========== TABLES API ==========

export const tablesApi = {
  getAll: (status?: number) =>
    api.get<Table[]>('/tables', status !== undefined ? { status } : undefined),
    
  getById: (id: number) =>
    api.get<Table>(`/tables/${id}`),
    
  getByNumber: (tableNumber: number) =>
    api.get<Table>(`/tables/number/${tableNumber}`),
    
  getStats: () =>
    api.get<{ total: number; available: number; occupied: number; reserved: number; occupancyRate: number }>('/tables/stats'),
    
  create: (data: CreateTableDto) =>
    api.post<Table>('/tables', data),
    
  update: (id: number, data: UpdateTableDto) =>
    api.put<Table>(`/tables/${id}`, data),
    
  delete: (id: number) =>
    api.delete<void>(`/tables/${id}`),
};

// ========== MENU ITEMS API ==========

export const menuItemsApi = {
  getAll: (params?: { category?: string; isAvailable?: boolean }) =>
    api.get<MenuItem[]>('/menuitems', params),
    
  getById: (id: number) =>
    api.get<MenuItem>(`/menuitems/${id}`),
    
  create: (data: CreateMenuItemDto) =>
    api.post<MenuItem>('/menuitems', data),
    
  update: (id: number, data: UpdateMenuItemDto) =>
    api.put<MenuItem>(`/menuitems/${id}`, data),
    
  toggleAvailability: (id: number) =>
    api.put<MenuItem>(`/menuitems/${id}/toggle-availability`),
    
  delete: (id: number) =>
    api.delete<void>(`/menuitems/${id}`),
};

// ========== ANALYTICS API ==========

export const analyticsApi = {
  getDashboard: (params?: { startDate?: string; endDate?: string }) =>
    api.get<{
      period: { start: string; end: string };
      summary: {
        totalRevenue: number;
        totalOrders: number;
        averageTicket: number;
        pendingOrders: number;
      };
      dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
      statusDistribution: Array<{ status: string; count: number; percentage: number }>;
    }>('/analytics/dashboard', params),
    
  getAverageTicket: (params?: { startDate?: string; endDate?: string }) =>
    api.get<{
      averageTicket: number;
      totalOrders: number;
      totalRevenue: number;
    }>('/analytics/average-ticket', params),
    
  getTopSellingItems: (params?: { startDate?: string; endDate?: string; limit?: number }) =>
    api.get<Array<{
      productName: string;
      totalQuantity: number;
      totalRevenue: number;
      orderCount: number;
    }>>('/analytics/top-selling-items', params),
    
  getSalesByHour: (params?: { startDate?: string; endDate?: string }) =>
    api.get<{
      date: string;
      hourlyData: Array<{ hour: number; orderCount: number; totalRevenue: number; averageTicket: number }>;
      peakHour: number;
      totalDayRevenue: number;
      totalDayOrders: number;
    }>('/analytics/sales-by-hour', params),
    
  getComparison: () =>
    api.get<{
      daily: {
        today: { revenue: number; orders: number; averageTicket: number };
        yesterday: { revenue: number; orders: number; averageTicket: number };
        change: { revenuePercentage: number; ordersPercentage: number; trend: string };
      };
      weekly: {
        thisWeek: { revenue: number; orders: number; averageTicket: number };
        lastWeek: { revenue: number; orders: number; averageTicket: number };
        change: { revenuePercentage: number; ordersPercentage: number; trend: string };
      };
      monthly: {
        thisMonth: { revenue: number; orders: number; averageTicket: number };
        lastMonth: { revenue: number; orders: number; averageTicket: number };
        change: { revenuePercentage: number; ordersPercentage: number; trend: string };
      };
    }>('/analytics/comparison'),
};

// ========== DASHBOARD API ==========

export const dashboardApi = {
  getStats: async () => {
    // Combinar dados de diferentes endpoints
    const [ordersData, tablesStats, comparison] = await Promise.all([
      ordersApi.getAll({ status: 0 }), // Apenas pedidos em andamento
      tablesApi.getStats(),
      analyticsApi.getComparison()
    ]);
    
    return {
      activeOrders: ordersData.length,
      todayRevenue: comparison.daily.today.revenue,
      averageOrderTime: 18, // TODO: Calcular tempo médio real
      tablesOccupied: tablesStats.occupied,
      totalTables: tablesStats.total
    };
  },
    
  getRecentOrders: (limit: number = 3) =>
    ordersApi.getAll().then(orders => 
      orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
        .map(order => ({
          id: order.id,
          tableNumber: order.tableNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        }))
    ),
    
  getTopItems: (limit: number = 3) =>
    analyticsApi.getTopSellingItems({ limit }).then(items =>
      items.map(item => ({
        name: item.productName,
        quantity: item.totalQuantity,
        revenue: item.totalRevenue
      }))
    ),
};
