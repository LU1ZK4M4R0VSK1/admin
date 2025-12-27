/**
 * Configuração do Restaurante/Marca
 * Este arquivo permite personalizar a aplicação para diferentes restaurantes
 * 
 * INSTRUÇÕES PARA USAR COM OUTROS RESTAURANTES:
 * 1. Duplique este arquivo ou crie um novo com as informações do restaurante
 * 2. Atualize as variáveis de ambiente (.env) com o novo backend
 * 3. Ajuste cores, logo e textos conforme a identidade visual
 */

export interface RestaurantConfig {
  // Informações Básicas
  name: string;
  slug: string;
  description: string;
  
  // Branding
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  
  // API Configuration
  apiUrl: string;
  apiTimeout?: number;
  
  // Features habilitadas
  features: {
    analytics: boolean;
    orders: boolean;
    menu: boolean;
    tables: boolean;
    payments: boolean;
    reports: boolean;
  };
  
  // Localização
  locale: string;
  currency: string;
  timezone: string;
  
  // Customizações
  customization?: {
    headerTitle?: string;
    dashboardWelcome?: string;
    dateFormat?: string;
  };
}

/**
 * Configuração padrão - AeroComidas
 * Para outros restaurantes, crie um arquivo similar ou use variáveis de ambiente
 */
export const defaultConfig: RestaurantConfig = {
  // Informações Básicas
  name: import.meta.env.VITE_RESTAURANT_NAME || 'AeroComidas',
  slug: import.meta.env.VITE_RESTAURANT_SLUG || 'aerocomidas',
  description: 'Sistema de Gestão de Restaurante',
  
  // Branding
  logo: import.meta.env.VITE_RESTAURANT_LOGO,
  primaryColor: import.meta.env.VITE_PRIMARY_COLOR || '#3b82f6',
  secondaryColor: import.meta.env.VITE_SECONDARY_COLOR || '#8b5cf6',
  
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  apiTimeout: 30000,
  
  // Features habilitadas
  features: {
    analytics: true,
    orders: true,
    menu: true,
    tables: true,
    payments: true,
    reports: true,
  },
  
  // Localização
  locale: 'pt-BR',
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  
  // Customizações
  customization: {
    headerTitle: 'Analytics Dashboard',
    dashboardWelcome: 'Acompanhe o desempenho do seu restaurante em tempo real',
    dateFormat: 'dd/MM/yyyy',
  },
};

/**
 * Hook para acessar a configuração do restaurante
 */
export function useRestaurantConfig(): RestaurantConfig {
  return defaultConfig;
}

/**
 * Utilitário para formatar moeda baseado na configuração
 */
export function formatCurrency(value: number, config: RestaurantConfig = defaultConfig): string {
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(value);
}

/**
 * Utilitário para formatar moeda compacta
 */
export function formatCurrencyCompact(value: number, config: RestaurantConfig = defaultConfig): string {
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    notation: 'compact',
  }).format(value);
}

/**
 * Utilitário para formatar números
 */
export function formatNumber(value: number, config: RestaurantConfig = defaultConfig): string {
  return new Intl.NumberFormat(config.locale).format(value);
}
