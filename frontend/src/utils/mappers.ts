/**
 * Utilitários para mapear enums
 */

import { OrderStatus, TableStatus } from '@/types';

/**
 * Mapeamento de status de pedido para texto em português
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pendente]: 'Pendente',
  [OrderStatus.Preparando]: 'Preparando',
  [OrderStatus.Pronto]: 'Pronto',
  [OrderStatus.Entregue]: 'Entregue',
  [OrderStatus.Cancelado]: 'Cancelado'
};

/**
 * Mapeamento de status de pedido para cores
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.Pendente]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.Preparando]: 'bg-blue-100 text-blue-800',
  [OrderStatus.Pronto]: 'bg-green-100 text-green-800',
  [OrderStatus.Entregue]: 'bg-gray-100 text-gray-800',
  [OrderStatus.Cancelado]: 'bg-red-100 text-red-800'
};

/**
 * Mapeamento de status de mesa para texto em português
 */
export const TABLE_STATUS_LABELS: Record<TableStatus, string> = {
  [TableStatus.Disponivel]: 'Disponível',
  [TableStatus.Ocupada]: 'Ocupada',
  [TableStatus.Reservada]: 'Reservada',
  [TableStatus.Limpeza]: 'Em Limpeza'
};

/**
 * Mapeamento de status de mesa para cores
 */
export const TABLE_STATUS_COLORS: Record<TableStatus, string> = {
  [TableStatus.Disponivel]: 'bg-green-100 text-green-800',
  [TableStatus.Ocupada]: 'bg-red-100 text-red-800',
  [TableStatus.Reservada]: 'bg-blue-100 text-blue-800',
  [TableStatus.Limpeza]: 'bg-yellow-100 text-yellow-800'
};

/**
 * Retorna label de status de pedido
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] || 'Desconhecido';
}

/**
 * Retorna cor de status de pedido
 */
export function getOrderStatusColor(status: OrderStatus): string {
  return ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Retorna label de status de mesa
 */
export function getTableStatusLabel(status: TableStatus): string {
  return TABLE_STATUS_LABELS[status] || 'Desconhecido';
}

/**
 * Retorna cor de status de mesa
 */
export function getTableStatusColor(status: TableStatus): string {
  return TABLE_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
}
