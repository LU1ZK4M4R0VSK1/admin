/**
 * Analytics Dashboard - Design moderno verde e branco
 * Relatórios e análises do restaurante
 */

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Sparkles,
  Calendar,
  ArrowUp,
  ArrowDown,
  Package
} from 'lucide-react';

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  topSellingItems: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  revenueByPeriod: Array<{
    date: string;
    revenue: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchMetrics();
  }, [period]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/analytics/dashboard?period=${period}`);
      if (!response.ok) throw new Error('Erro ao buscar métricas');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin border-t-green-600 mx-auto"></div>
            <Sparkles className="w-6 h-6 text-green-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-slate-600 mt-6 font-medium">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Relatórios</h1>
          <p className="text-slate-600">Análise de desempenho do restaurante</p>
        </div>
        <div className="flex gap-2">
          {[
            { value: 'today', label: 'Hoje' },
            { value: 'week', label: 'Semana' },
            { value: 'month', label: 'Mês' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                period === value
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-200">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-lg">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">12%</span>
            </div>
          </div>
          <p className="text-sm text-green-700 mb-1 font-medium">Faturamento</p>
          <p className="text-3xl font-bold text-green-700">
            {formatCurrency(metrics?.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-200">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-lg">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">8%</span>
            </div>
          </div>
          <p className="text-sm text-green-700 mb-1 font-medium">Total de Pedidos</p>
          <p className="text-3xl font-bold text-green-700">{metrics?.totalOrders || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-200">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-lg">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">5%</span>
            </div>
          </div>
          <p className="text-sm text-green-700 mb-1 font-medium">Ticket Médio</p>
          <p className="text-3xl font-bold text-green-700">
            {formatCurrency(metrics?.averageTicket || 0)}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Faturamento por Dia</h2>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {metrics?.revenueByPeriod?.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(item.revenue / (metrics.revenueByPeriod[0]?.revenue || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Produtos Mais Vendidos</h2>
            <Package className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {metrics?.topSellingItems?.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-200">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-slate-900 truncate">{item.name}</p>
                    <span className="text-sm font-semibold text-green-600 ml-2">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{item.quantity} vendidos</span>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                <p>Nenhum produto vendido ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Clientes Atendidos</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{metrics?.totalOrders || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Itens Vendidos</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {metrics?.topSellingItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Crescimento</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-green-600">+12%</p>
            <ArrowUp className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Produtos Ativos</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {metrics?.topSellingItems?.length || 0}
          </p>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Exportar Relatórios</h3>
        <p className="text-slate-600 mb-6">Baixe relatórios completos em PDF ou Excel</p>
        <div className="flex gap-3 justify-center">
          <button className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium">
            Exportar PDF
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all font-medium">
            Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );
}
