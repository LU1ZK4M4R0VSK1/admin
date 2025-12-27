import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign,
  Clock,
  Users
} from "lucide-react";

interface DashboardStats {
  activeOrders: number;
  todayRevenue: number;
  averageOrderTime: number;
  tablesOccupied: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    todayRevenue: 0,
    averageOrderTime: 0,
    tablesOccupied: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        activeOrders: 12,
        todayRevenue: 4850.50,
        averageOrderTime: 18,
        tablesOccupied: 8
      });
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: "Pedidos Ativos",
      value: stats.activeOrders,
      icon: ShoppingBag,
      color: "bg-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Receita Hoje",
      value: `R$ ${stats.todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Tempo Médio",
      value: `${stats.averageOrderTime} min`,
      icon: Clock,
      color: "bg-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Mesas Ocupadas",
      value: stats.tablesOccupied,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin border-t-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Visão geral do restaurante</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color.split('-')[1]}-600`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group">
            <ShoppingBag className="w-8 h-8 text-slate-400 group-hover:text-green-600 mb-2" />
            <h3 className="font-semibold text-slate-900">Novo Pedido</h3>
            <p className="text-sm text-slate-600">Criar pedido manualmente</p>
          </button>
          <button className="p-4 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group">
            <Users className="w-8 h-8 text-slate-400 group-hover:text-green-600 mb-2" />
            <h3 className="font-semibold text-slate-900">Ver Mesas</h3>
            <p className="text-sm text-slate-600">Gerenciar mesas</p>
          </button>
          <button className="p-4 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group">
            <TrendingUp className="w-8 h-8 text-slate-400 group-hover:text-green-600 mb-2" />
            <h3 className="font-semibold text-slate-900">Relatórios</h3>
            <p className="text-sm text-slate-600">Ver análises</p>
          </button>
        </div>
      </div>
    </div>
  );
}
