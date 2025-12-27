import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Plus, QrCode, ToggleLeft, ToggleRight, UserCheck, UserX, Clock } from "lucide-react";

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  isActive: boolean;
}

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      // Simular dados
      setTables([
        { id: 1, number: 1, capacity: 4, status: "available", isActive: true },
        { id: 2, number: 2, capacity: 2, status: "occupied", isActive: true },
        { id: 3, number: 3, capacity: 6, status: "available", isActive: true },
        { id: 4, number: 4, capacity: 4, status: "reserved", isActive: true },
        { id: 5, number: 5, capacity: 8, status: "available", isActive: false },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
        return {
          label: "Disponível",
          color: "bg-primary/10 text-primary border-primary/20",
          icon: UserCheck,
          iconColor: "text-primary",
          cardBg: "bg-primary/5 border-primary/20"
        };
      case "occupied":
        return {
          label: "Ocupada",
          color: "bg-red-50 text-red-600 border-red-200",
          icon: UserX,
          iconColor: "text-red-500",
          cardBg: "bg-red-50/50 border-red-200"
        };
      case "reserved":
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

  const availableCount = tables.filter(t => t.status === "available" && t.isActive).length;
  const occupiedCount = tables.filter(t => t.status === "occupied").length;
  const reservedCount = tables.filter(t => t.status === "reserved").length;

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
        <button className="btn-primary flex items-center justify-center gap-2 w-full lg:w-auto">
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
          <p className="text-3xl font-display font-bold text-foreground">{tables.length}</p>
        </div>
        <div className="card-premium p-5 bg-primary/5 border-primary/20">
          <p className="text-sm text-primary font-medium mb-1">Disponíveis</p>
          <p className="text-3xl font-display font-bold text-primary">{availableCount}</p>
        </div>
        <div className="card-premium p-5 bg-red-50/50 border-red-200">
          <p className="text-sm text-red-600 font-medium mb-1">Ocupadas</p>
          <p className="text-3xl font-display font-bold text-red-600">{occupiedCount}</p>
        </div>
        <div className="card-premium p-5 bg-amber-50/50 border-amber-200">
          <p className="text-sm text-amber-600 font-medium mb-1">Reservadas</p>
          <p className="text-3xl font-display font-bold text-amber-600">{reservedCount}</p>
        </div>
      </motion.div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tables.map((table, index) => {
          const statusConfig = getStatusConfig(table.status);
          const StatusIcon = statusConfig.icon;
          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card-premium p-6 ${!table.isActive ? 'opacity-50' : ''} ${table.isActive ? statusConfig.cardBg : ''}`}
            >
              {/* Table Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    table.status === "available" ? "bg-primary/10" :
                    table.status === "occupied" ? "bg-red-100" : "bg-amber-100"
                  }`}>
                    <span className={`font-display font-bold text-2xl ${
                      table.status === "available" ? "text-primary" :
                      table.status === "occupied" ? "text-red-600" : "text-amber-600"
                    }`}>
                      {table.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">Mesa {table.number}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {table.capacity} pessoas
                    </p>
                  </div>
                </div>
                <button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title={table.isActive ? "Desativar mesa" : "Ativar mesa"}
                >
                  {table.isActive ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              {/* Status Badge */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border mb-5 ${statusConfig.color}`}>
                <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                {statusConfig.label}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3">
                  <QrCode className="w-5 h-5" />
                  QR Code
                </button>
                <button className="flex-1 btn-ghost border border-border py-3">
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
