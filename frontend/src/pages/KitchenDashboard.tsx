import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Clock, CheckCircle, XCircle, AlertCircle, Timer } from "lucide-react";

interface Order {
  id: number;
  tableId: number;
  status: string;
  items: Array<{
    id: number;
    productName: string;
    quantity: number;
    notes?: string;
  }>;
  createdAt: string;
}

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Atualizar a cada 10 segundos
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      // Simular dados para desenvolvimento
      setOrders([
        {
          id: 1,
          tableId: 5,
          status: "Pendente",
          createdAt: new Date().toISOString(),
          items: [
            { id: 1, productName: "Hambúrguer Clássico", quantity: 2 },
            { id: 2, productName: "Batata Frita", quantity: 1, notes: "Sem sal" }
          ]
        },
        {
          id: 2,
          tableId: 3,
          status: "Preparando",
          createdAt: new Date().toISOString(),
          items: [
            { id: 3, productName: "Pizza Margherita", quantity: 1 }
          ]
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    console.log(`Atualizando pedido ${orderId} para ${newStatus}`);
    // Implementar chamada à API
    await fetchOrders();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pendente":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: AlertCircle,
          iconColor: "text-amber-500"
        };
      case "Preparando":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Timer,
          iconColor: "text-blue-500"
        };
      case "Pronto":
        return {
          color: "bg-primary/10 text-primary border-primary/20",
          icon: CheckCircle,
          iconColor: "text-primary"
        };
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          icon: AlertCircle,
          iconColor: "text-muted-foreground"
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando pedidos...</p>
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
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Cozinha</h1>
            <p className="text-muted-foreground">Gerenciar pedidos em tempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              {orders.filter(o => o.status === "Pendente").length} pendentes
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
            <Timer className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {orders.filter(o => o.status === "Preparando").length} preparando
            </span>
          </div>
        </div>
      </motion.div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full"
          >
            <div className="card-premium p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">Nenhum pedido ativo</h3>
              <p className="text-muted-foreground">Nenhum pedido ativo no momento</p>
            </div>
          </motion.div>
        ) : (
          orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 group"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="font-display font-bold text-primary text-lg">{order.tableId}</span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">Mesa {order.tableId}</p>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-sm">
                          {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border ${statusConfig.color}`}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2.5 mb-5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                      <span className="flex-shrink-0 w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary text-sm">
                        {item.quantity}x
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.productName}</p>
                        {item.notes && (
                          <p className="text-sm text-amber-600 mt-0.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {order.status === "Pendente" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Preparando")}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-primary-foreground py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                    >
                      Preparar
                    </button>
                  )}
                  {order.status === "Preparando" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Pronto")}
                      className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Finalizar
                    </button>
                  )}
                  <button
                    onClick={() => updateOrderStatus(order.id, "Cancelado")}
                    className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
