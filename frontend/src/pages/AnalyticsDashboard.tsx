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
  Sparkles,
  ArrowUp,
  ArrowDown,
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
import { analyticsApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';

export default function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
  }, [period]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const startDate = getStartDate(period);
      const endDate = new Date().toISOString().split('T')[0];
      
      const [dashboard, items] = await Promise.all([
        analyticsApi.getDashboard({ startDate, endDate }),
        analyticsApi.getTopSellingItems({ startDate, endDate, limit: 5 })
      ]);
      
      setDashboardData(dashboard);
      setTopItems(items);
      setLoading(false);
    } catch (err) {
      console.error('Erro:', err);
      toast({
        title: "Erro ao carregar relatórios",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const getStartDate = (period: string): string => {
    const now = new Date();
    switch (period) {
      case 'day':
        return now.toISOString().split('T')[0];
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return weekAgo.toISOString().split('T')[0];
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return monthAgo.toISOString().split('T')[0];
      default:
        return now.toISOString().split('T')[0];
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading || !dashboardData) {
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

  const { summary, dailyRevenue } = dashboardData;

  const revenueByTime = dailyRevenue && dailyRevenue.length > 0
    ? dailyRevenue.map((item: any) => ({
        time: new Date(item.date).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo'
        }),
        total: item.revenue
      })).sort((a: any, b: any) => a.time.localeCompare(b.time))
    : [];

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
            { value: 'day', label: 'Hoje' },
            { value: 'week', label: 'Semana' },
            { value: 'month', label: 'Mês' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value as any)}
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
            value: formatCurrency(summary.totalRevenue || 0), 
            trend: "+12%", 
            icon: DollarSign 
          },
          { 
            label: "Total de Pedidos", 
            value: summary.totalOrders || 0, 
            trend: "+8%", 
            icon: ShoppingCart 
          },
          { 
            label: "Ticket Médio", 
            value: formatCurrency(summary.averageTicket || 0), 
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium p-6"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-6">Faturamento por Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueByTime}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => formatCurrency(value)}
                labelFormatter={(label) => `Horário: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="rgb(34, 197, 94)" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Items Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium p-6"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-6">Top 5 Produtos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topItems.map(item => ({ 
              name: item.productName.length > 15 ? item.productName.substring(0, 15) + '...' : item.productName,
              quantidade: item.totalQuantity 
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="quantidade" fill="rgb(34, 197, 94)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Selling Items Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-premium p-6"
      >
        <h2 className="text-xl font-display font-bold text-foreground mb-6">Itens Mais Vendidos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Produto</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Quantidade</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Receita</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Pedidos</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-foreground">{item.productName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-foreground">{item.totalQuantity}</td>
                  <td className="py-4 px-4 text-right font-semibold text-primary">{formatCurrency(item.totalRevenue)}</td>
                  <td className="py-4 px-4 text-right text-muted-foreground">{item.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
