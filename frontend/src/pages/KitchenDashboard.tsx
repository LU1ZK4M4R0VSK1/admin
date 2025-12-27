import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Clock, CheckCircle, XCircle, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { ordersApi } from "@/lib/services";
import { Order, OrderStatus, OrderStatusLabels } from "@/lib/types";
import { formatTime, getRelativeTime } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const data = await ordersApi.getAll(filter !== null ? { status: filter } : undefined);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erro ao carregar pedidos",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: number) => {
    try {
      await ordersApi.changeStatus(orderId, {
        newStatus,
        changedBy: "Sistema",
        notes: `Status alterado para ${OrderStatusLabels[newStatus]}`,
      });
      toast({
        title: "Status atualizado",
        description: `Pedido #${orderId} atualizado com sucesso`,
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm("Deseja realmente excluir este pedido?")) return;
    try {
      await ordersApi.delete(orderId);
      toast({
        title: "Pedido excluído",
        description: `Pedido #${orderId} foi removido`,
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Erro ao excluir pedido",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "em andamento":
      case "emandamento":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: AlertCircle,
          iconColor: "text-amber-500",
        };
      case "entregue":
        return {
          color: "bg-primary/10 text-primary border-primary/20",
          icon: CheckCircle,
          iconColor: "text-primary",
        };
      case "pago":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "cancelado":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
          iconColor: "text-red-500",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          icon: AlertCircle,
          iconColor: "text-muted-foreground",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between"
      >
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <div className="flex gap-2">
          <button onClick={() => setFilter(null)}>Todos</button>
          <button onClick={() => setFilter(OrderStatus.EmAndamento)}>Em Andamento</button>
          <button onClick={() => setFilter(OrderStatus.Entregue)}>Entregue</button>
          <button onClick={() => setFilter(OrderStatus.Pago)}>Pago</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <p>Nenhum pedido encontrado</p>
        ) : (
          orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div key={order.id} className="card-premium p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p>Mesa {order.tableNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(order.createdAt)} • {getRelativeTime(order.createdAt)}
                    </p>
                  </div>
                  <div className={statusConfig.color}>
                    <StatusIcon className={statusConfig.iconColor} /> {order.status}
                  </div>
                </div>

                {order.items.map((item) => (
                  <div key={item.id}>
                    {item.quantity}x {item.productName}
                  </div>
                ))}

                <div className="mt-4 font-bold">
                  Total: R$ {order.totalAmount.toFixed(2)}
                </div>

                <div className="flex gap-2 mt-4">
                  {order.status.toLowerCase() === "em andamento" && (
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.Entregue)}>
                      Entregue
                    </button>
                  )}
                  {order.status.toLowerCase() === "entregue" && (
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.Pago)}>
                      Pago
                    </button>
                  )}
                  <button onClick={() => deleteOrder(order.id)}>
                    <Trash2 size={16} />
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
