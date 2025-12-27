/**
 * Tipos relacionados a Analytics e BI
 */

export interface TableAnalytics {
  tableId: number;
  tableNumber: number;
  location?: string;
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  topProducts: string[];
  lastOrderDate?: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  topProducts: ProductSales[];
  hourlySales: HourlySales[];
  orderStatusDistribution: Record<string, number>;
}

export interface ProductSales {
  productName: string;
  quantity: number;
  revenue: number;
  orderCount: number;
}

export interface HourlySales {
  hour: number;
  orderCount: number;
  revenue: number;
}

export interface DateRangeDto {
  startDate?: string;
  endDate?: string;
}
