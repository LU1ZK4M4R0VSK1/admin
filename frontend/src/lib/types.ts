/**
 * TypeScript types for API responses
 * Matches backend DTOs
 */

// ========== ORDER TYPES ==========

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface OrderStatusHistory {
  id: number;
  fromStatus: string;
  toStatus: string;
  changedAt: string;
  notes?: string;
  changedBy?: string;
}

export interface Order {
  id: number;
  tableId: number;
  tableNumber: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  paidAt?: string;
  cancelledAt?: string;
  deliveredAt?: string;
  totalAmount: number;
  customerNotes?: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
  canEdit: boolean;
}

export interface CreateOrderDto {
  tableId: number;
  items: CreateOrderItemDto[];
  customerNotes?: string;
}

export interface CreateOrderItemDto {
  productName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface UpdateOrderDto {
  items?: CreateOrderItemDto[];
  customerNotes?: string;
}

export interface ChangeOrderStatusDto {
  newStatus: number;
  notes?: string;
  changedBy?: string;
}

// ========== TABLE TYPES ==========

export interface Table {
  id: number;
  tableNumber: number;
  capacity: number;
  status: string;
  location?: string;
  occupiedSince?: string;
  currentWaiter?: string;
  totalOrders: number;
  activeOrders: OrderSummary[];
}

export interface OrderSummary {
  id: number;
  status: string;
  createdAt: string;
  totalAmount: number;
  elapsedTime: string;
}

export interface CreateTableDto {
  tableNumber: number;
  capacity: number;
  location?: string;
}

export interface UpdateTableDto {
  capacity?: number;
  status?: number;
  location?: string;
  currentWaiter?: string;
}

// ========== MENU ITEM TYPES ==========

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  ingredients?: string;
  allergens?: string;
  isAvailable: boolean;
  preparationTimeMinutes?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  ingredients?: string;
  isAvailable?: boolean;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  ingredients?: string;
  isAvailable?: boolean;
}

// ========== ANALYTICS TYPES ==========

export interface DashboardStats {
  activeOrders: number;
  todayRevenue: number;
  averageOrderTime: number;
  tablesOccupied: number;
  totalTables: number;
}

export interface RecentOrder {
  id: number;
  tableNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface TopMenuItem {
  name: string;
  quantity: number;
  revenue: number;
}

export interface RevenueByPeriod {
  date: string;
  revenue: number;
}

export interface AnalyticsMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  topSellingItems: TopMenuItem[];
  revenueByPeriod: RevenueByPeriod[];
  growth?: number;
}

// ========== ENUMS ==========

export enum OrderStatus {
  EmAndamento = 0,
  Cancelado = 1,
  Entregue = 2,
  Pago = 3
}

export enum TableStatus {
  Disponivel = 0,
  Ocupada = 1,
  Reservada = 2
}

export const OrderStatusLabels: Record<number, string> = {
  0: 'Em Andamento',
  1: 'Cancelado',
  2: 'Entregue',
  3: 'Pago'
};

export const TableStatusLabels: Record<number, string> = {
  0: 'Disponível',
  1: 'Ocupada',
  2: 'Reservada'
};
