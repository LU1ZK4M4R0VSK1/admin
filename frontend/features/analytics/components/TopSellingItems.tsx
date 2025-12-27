import { cn } from "@/lib/utils";

interface TopItem {
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

interface TopSellingItemsProps {
  data: TopItem[];
  limit?: number;
}

const rankColors = [
  { bg: "bg-emerald-500", text: "text-white" },
  { bg: "bg-amber-500", text: "text-white" },
  { bg: "bg-purple-500", text: "text-white" },
  { bg: "bg-gray-400", text: "text-white" },
  { bg: "bg-gray-400", text: "text-white" },
];

export function TopSellingItems({ data, limit = 5 }: TopSellingItemsProps) {
  const items = data.slice(0, limit);
  const maxRevenue = Math.max(...items.map((item) => item.totalRevenue));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="h-full">
      <div className="space-y-3 sm:space-y-4">
        {items.map((item, index) => {
          const widthPercent = (item.totalRevenue / maxRevenue) * 100;
          const colors = rankColors[index] || rankColors[3];
          
          return (
            <div key={item.productName} className="group">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <span
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0",
                    colors.bg,
                    colors.text
                  )}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {item.productName}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {item.totalQuantity} {item.totalQuantity === 1 ? 'unidade' : 'unidades'} • Em {item.orderCount} {item.orderCount === 1 ? 'pedido' : 'pedidos'}
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {formatCurrency(item.totalRevenue)}
                </span>
              </div>
              <div className="relative h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden ml-9 sm:ml-11">
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
