import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Plus, QrCode, ToggleLeft, ToggleRight, UserCheck, UserX, Clock } from "lucide-react";
import { tablesApi } from "@/lib/services";
import { Table, TableStatus, TableStatusLabels } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0, reserved: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchTables();
    fetchStats();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await tablesApi.getAll();
      setTables(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
      toast({
        title: "Erro ao carregar mesas",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await tablesApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "disponível":
      case "disponivel":
        return {
          label: "Disponível",
          color: "bg-primary/10 text-primary border-primary/20",
          icon: UserCheck,
          iconColor: "text-primary",
          cardBg: "bg-primary/5 border-primary/20"
        };
      case "ocupada":
        return {
          label: "Ocupada",
          color: "bg-red-50 text-red-600 border-red-200",
          icon: UserX,
          iconColor: "text-red-500",
          cardBg: "bg-red-50/50 border-red-200"
        };
      case "reservada":
        return {
          label: "Reservada",
          color: "bg-amber-50 text-amber-600 border-amber-200",
          icon: Clock,
          iconColor: "text-amber-500",
          cardBg: "bg-amber-50/50 border-amber-200"
        };
      default:
        return {
          label: "Desconhecido",
          color: "bg-muted text-muted-foreground border-border",
          icon: Users,
          iconColor: "text-muted-foreground",
          cardBg: "border-border"
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando mesas...</p>
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
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Mesas</h1>
            <p className="text-muted-foreground">Gerenciar mesas do restaurante</p>
          </div>
        </div>
        <button 
          className="btn-primary flex items-center justify-center gap-2 w-full lg:w-auto"
          onClick={() => {/* TODO: Implementar modal de criação */}}
        >
          <Plus className="w-5 h-5" />
          Adicionar Mesa
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="card-premium p-5">
          <p className="text-sm text-muted-foreground font-medium mb-1">Total de Mesas</p>
          <p className="text-3xl font-display font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="card-premium p-5 bg-primary/5 border-primary/20">
          <p className="text-sm text-primary font-medium mb-1">Disponíveis</p>
          <p className="text-3xl font-display font-bold text-primary">{stats.available}</p>
        </div>
        <div className="card-premium p-5 bg-red-50/50 border-red-200">
          <p className="text-sm text-red-600 font-medium mb-1">Ocupadas</p>
          <p className="text-3xl font-display font-bold text-red-600">{stats.occupied}</p>
        </div>
        <div className="card-premium p-5 bg-amber-50/50 border-amber-200">
          <p className="text-sm text-amber-600 font-medium mb-1">Reservadas</p>
          <p className="text-3xl font-display font-bold text-amber-600">{stats.reserved}</p>
        </div>
      </motion.div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tables.map((table, index) => {
          const statusConfig = getStatusConfig(table.status);
          const StatusIcon = statusConfig.icon;
          const hasActiveOrders = table.activeOrders && table.activeOrders.length > 0;
          
          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card-premium p-6 ${statusConfig.cardBg}`}
            >
              {/* Table Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    statusConfig.label === "Disponível" ? "bg-primary/10" :
                    statusConfig.label === "Ocupada" ? "bg-red-100" : "bg-amber-100"
                  }`}>
                    <span className={`font-display font-bold text-2xl ${
                      statusConfig.label === "Disponível" ? "text-primary" :
                      statusConfig.label === "Ocupada" ? "text-red-600" : "text-amber-600"
                    }`}>
                      {table.tableNumber}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">Mesa {table.tableNumber}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {table.capacity} pessoas
                    </p>
                    {table.location && (
                      <p className="text-xs text-muted-foreground">{table.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border mb-5 ${statusConfig.color}`}>
                <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                {statusConfig.label}
              </div>

              {/* Current Waiter */}
              {table.currentWaiter && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Garçom:</strong> {table.currentWaiter}
                  </p>
                </div>
              )}

              {/* Active Orders */}
              {hasActiveOrders && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Pedidos ativos: {table.activeOrders.length}</p>
                  {table.activeOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg mb-1">
                      <span className="text-sm font-medium">#{order.id}</span>
                      <span className="text-sm text-primary font-bold">R$ {order.totalAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3"
                  onClick={() => {
                    const qrCodeUrl = `${window.location.origin}/mesa/${table.id}/cardapio`;
                    toast({
                      title: "QR Code",
                      description: `Link: ${qrCodeUrl}`
                    });
                  }}
                >
                  <QrCode className="w-5 h-5" />
                  QR Code
                </button>
                <button 
                  className="flex-1 btn-ghost border border-border py-3"
                  onClick={() => {/* TODO: Implementar modal de edição */}}
                >
                  Editar
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
