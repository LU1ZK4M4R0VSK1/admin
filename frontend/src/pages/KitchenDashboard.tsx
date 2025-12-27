import { useEffect, useState } from "react";
import { ChefHat, Clock, CheckCircle, XCircle } from "lucide-react";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Preparando":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Pronto":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin border-t-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <ChefHat className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cozinha</h1>
          <p className="text-slate-600">Gerenciar pedidos em tempo real</p>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Nenhum pedido ativo no momento</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-green-600">{order.tableId}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Mesa {order.tableId}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border-2 ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                    <span className="font-bold text-green-600 min-w-[24px]">{item.quantity}x</span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.productName}</p>
                      {item.notes && (
                        <p className="text-sm text-slate-600 italic">Obs: {item.notes}</p>
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
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                  >
                    Preparar
                  </button>
                )}
                {order.status === "Preparando" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Pronto")}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Finalizar
                  </button>
                )}
                <button
                  onClick={() => updateOrderStatus(order.id, "Cancelado")}
                  className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
