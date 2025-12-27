/**
 * Tipos TypeScript para o módulo de Analytics
 * Baseado nas respostas da API do AnalyticsController
 */

export interface Period {
  start: string;
  end: string;
}

export interface AverageTicketResponse {
  averageTicket: number;
  totalOrders: number;
  totalRevenue: number;
  period: Period;
}

export interface TopSellingItem {
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

export interface HourlyData {
  hour: number;
  orderCount: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface SalesByHourResponse {
  date: string;
  hourlyData: HourlyData[];
  peakHour: number;
  totalDayRevenue: number;
  totalDayOrders: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  pendingOrders: number;
  preparingOrders: number;
}

export interface DashboardResponse {
  period: Period;
  summary: DashboardSummary;
  dailyRevenue: DailyRevenue[];
  statusDistribution: StatusDistribution[];
}

export interface PeriodMetrics {
  revenue: number;
  orders: number;
  averageTicket: number;
}

export interface PeriodChange {
  revenuePercentage: number;
  ordersPercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ComparisonPeriod {
  today: PeriodMetrics;
  yesterday: PeriodMetrics;
  change: PeriodChange;
}

export interface WeeklyComparison {
  thisWeek: PeriodMetrics;
  lastWeek: PeriodMetrics;
  change: PeriodChange;
}

export interface MonthlyComparison {
  thisMonth: PeriodMetrics;
  lastMonth: PeriodMetrics;
  change: PeriodChange;
}

export interface PeriodComparisonResponse {
  daily: ComparisonPeriod;
  weekly: WeeklyComparison;
  monthly: MonthlyComparison;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface TopSellingParams extends DateRangeParams {
  limit?: number;
}

export interface SalesByHourParams extends DateRangeParams {
  // Aceita startDate e endDate para agregar vendas por hora em um período
}
