/**
 * Analytics Dashboard - Design moderno verde e branco
 * Relatórios e análises do restaurante
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Sparkles,
  Calendar,
  ArrowUp,
  ArrowDown,
  Package,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

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
      // Simulated data for demonstration
      setMetrics({
        totalRevenue: 15840.50,
        totalOrders: 124,
        averageTicket: 127.75,
        topSellingItems: [
          { name: "Hambúrguer Clássico", quantity: 45, revenue: 1165.50 },
          { name: "Pizza Margherita", quantity: 32, revenue: 1280.00 },
          { name: "Batata Frita", quantity: 28, revenue: 420.00 },
          { name: "Refrigerante", quantity: 67, revenue: 536.00 },
          { name: "Pudim", quantity: 18, revenue: 216.00 },
        ],
        revenueByPeriod: [
          { date: "2024-01-01", revenue: 2450 },
          { date: "2024-01-02", revenue: 3200 },
          { date: "2024-01-03", revenue: 2800 },
          { date: "2024-01-04", revenue: 3500 },
          { date: "2024-01-05", revenue: 4100 },
          { date: "2024-01-06", revenue: 3800 },
          { date: "2024-01-07", revenue: 4500 },
        ]
      });
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-muted-foreground mt-6 font-medium">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <TrendingUp className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Análise de desempenho do restaurante</p>
          </div>
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
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                period === value
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {[
          { 
            label: "Faturamento", 
            value: formatCurrency(metrics?.totalRevenue || 0), 
            trend: "+12%", 
            icon: DollarSign 
          },
          { 
            label: "Total de Pedidos", 
            value: metrics?.totalOrders || 0, 
            trend: "+8%", 
            icon: ShoppingCart 
          },
          { 
            label: "Ticket Médio", 
            value: formatCurrency(metrics?.averageTicket || 0), 
            trend: "+5%", 
            icon: TrendingUp 
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium p-6 bg-gradient-to-br from-primary/5 to-primary/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-card rounded-lg border border-border">
                  <ArrowUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{metric.trend}</span>
                </div>
              </div>
              <p className="text-sm text-primary font-medium mb-1">{metric.label}</p>
              <p className="text-3xl font-display font-bold text-foreground">
                {metric.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold text-foreground">Faturamento por Dia</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics?.revenueByPeriod || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `R$${value/1000}k`}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Receita']}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(160, 84%, 39%)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Selling Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold text-foreground">Produtos Mais Vendidos</h2>
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {metrics?.topSellingItems?.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <span className="text-sm font-semibold text-primary ml-2 flex-shrink-0">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.revenue / (metrics.topSellingItems[0]?.revenue || 1)) * 100}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.quantity} vendidos</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum produto vendido ainda</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Clientes Atendidos", value: metrics?.totalOrders || 0, icon: Users },
          { label: "Itens Vendidos", value: metrics?.topSellingItems?.reduce((sum, item) => sum + item.quantity, 0) || 0, icon: ShoppingCart },
          { label: "Crescimento", value: "+12%", icon: TrendingUp, isPercentage: true },
          { label: "Produtos Ativos", value: metrics?.topSellingItems?.length || 0, icon: Package },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-premium p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
              <p className={`text-2xl font-display font-bold ${stat.isPercentage ? 'text-primary' : 'text-foreground'}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </motion.div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-premium p-8 text-center bg-gradient-to-br from-muted/30 to-muted/50"
      >
        <h3 className="text-xl font-display font-bold text-foreground mb-2">Exportar Relatórios</h3>
        <p className="text-muted-foreground mb-6">Baixe relatórios completos em PDF ou Excel</p>
        <div className="flex gap-4 justify-center">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar PDF
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Excel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
