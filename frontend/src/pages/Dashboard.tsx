import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Clock,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ChefHat,
  UtensilsCrossed
} from "lucide-react";
import { Link } from "react-router-dom";

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
      trend: "+12%",
      trendUp: true,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500"
    },
    {
      title: "Receita Hoje",
      value: `R$ ${stats.todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      trend: "+8%",
      trendUp: true,
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/5",
      iconBg: "bg-gradient-primary"
    },
    {
      title: "Tempo Médio",
      value: `${stats.averageOrderTime} min`,
      icon: Clock,
      trend: "-5%",
      trendUp: true,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-500"
    },
    {
      title: "Mesas Ocupadas",
      value: `${stats.tablesOccupied}/12`,
      icon: Users,
      trend: "+2",
      trendUp: true,
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      iconBg: "bg-violet-500"
    }
  ];

  const quickActions = [
    {
      icon: ShoppingBag,
      title: "Novo Pedido",
      description: "Criar pedido manualmente",
      href: "/admin/pedidos",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    {
      icon: Users,
      title: "Ver Mesas",
      description: "Gerenciar mesas",
      href: "/admin/mesas",
      color: "text-violet-600",
      bgColor: "bg-violet-50 hover:bg-violet-100"
    },
    {
      icon: TrendingUp,
      title: "Relatórios",
      description: "Ver análises",
      href: "/admin/analytics",
      color: "text-primary",
      bgColor: "bg-primary/5 hover:bg-primary/10"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <LayoutDashboard className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do restaurante</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Última atualização:</span>
          <span className="text-sm font-medium text-foreground">Agora</span>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse ml-1"></div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                  stat.trendUp ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-600'
                }`}>
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{stat.title}</p>
              <p className="text-2xl lg:text-3xl font-display font-bold text-foreground">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-premium p-6"
      >
        <h2 className="text-xl font-display font-bold text-foreground mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className={`p-5 rounded-2xl border-2 border-border transition-all duration-300 group hover:border-primary/30 hover:shadow-lg ${action.bgColor}`}
              >
                <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card-premium p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">Pedidos Recentes</h2>
            <Link to="/admin/pedidos" className="text-sm text-primary font-medium hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { table: 5, items: 3, status: "Preparando", time: "2 min" },
              { table: 3, items: 2, status: "Pendente", time: "5 min" },
              { table: 8, items: 4, status: "Pronto", time: "12 min" },
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mesa {order.table}</p>
                    <p className="text-sm text-muted-foreground">{order.items} itens</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    order.status === "Pronto" ? "bg-primary/10 text-primary" :
                    order.status === "Preparando" ? "bg-blue-50 text-blue-600" :
                    "bg-amber-50 text-amber-600"
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">há {order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card-premium p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">Itens Populares</h2>
            <Link to="/admin/cardapio" className="text-sm text-primary font-medium hover:underline">
              Ver cardápio
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { name: "Hambúrguer Clássico", sold: 45, revenue: "R$ 1.165,50" },
              { name: "Pizza Margherita", sold: 32, revenue: "R$ 1.280,00" },
              { name: "Batata Frita", sold: 28, revenue: "R$ 420,00" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.sold} vendidos</p>
                  </div>
                </div>
                <p className="font-semibold text-primary">{item.revenue}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
