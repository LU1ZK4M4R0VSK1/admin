/**
 * Helpers para formatação e manipulação de dados de gráficos
 */

/**
 * Formata valor monetário para Real Brasileiro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata número com separadores de milhares
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/**
 * Converte hora (0-23) para formato legível (ex: "8h", "14h")
 */
export function formatHour(hour: number): string {
  return `${hour}h`;
}

/**
 * Converte data ISO para formato brasileiro
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateFormat('pt-BR').format(date);
}

/**
 * Converte data ISO para formato curto (ex: "20/12")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

/**
 * Retorna cor baseada na tendência
 */
export function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
      return 'text-gray-600';
  }
}

/**
 * Retorna ícone baseado na tendência
 */
export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    case 'stable':
      return '→';
  }
}

/**
 * Paleta de cores para gráficos
 */
export const CHART_COLORS = {
  primary: '#3b82f6', // blue-500
  secondary: '#8b5cf6', // violet-500
  success: '#10b981', // green-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  info: '#06b6d4', // cyan-500
  gray: '#6b7280', // gray-500
};

/**
 * Array de cores para gráficos múltiplos
 */
export const CHART_COLOR_PALETTE = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#f97316', // orange
];
