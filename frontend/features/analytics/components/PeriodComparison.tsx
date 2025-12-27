import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricData {
  revenue: number;
  orders: number;
  averageTicket: number;
}

interface PeriodData {
  today?: MetricData;
  yesterday?: MetricData;
  thisWeek?: MetricData;
  lastWeek?: MetricData;
  thisMonth?: MetricData;
  lastMonth?: MetricData;
  change?: any;
}

interface PeriodComparisonProps {
  data: {
    daily: PeriodData;
    weekly: PeriodData;
    monthly: PeriodData;
  };
}

type PeriodKey = "daily" | "weekly" | "monthly";

const periodLabels: Record<PeriodKey, { current: string; previous: string }> = {
  daily: { current: "Hoje", previous: "Ontem" },
  weekly: { current: "Esta Semana", previous: "Semana Passada" },
  monthly: { current: "Este Mês", previous: "Mês Passado" },
};

export function PeriodComparison({ data }: PeriodComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: "compact",
    }).format(value);
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrend = (change: number) => {
    if (change > 0) return "up";
    if (change < 0) return "down";
    return "stable";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3" />;
      case "down":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-3 sm:p-4 lg:p-5 card-shadow animate-fade-in">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 lg:mb-5">
        Comparação de Períodos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {(Object.keys(data) as PeriodKey[]).map((period) => {
          const periodData = data[period];
          
          // Adaptar estrutura da API para o formato esperado
          const current = period === 'daily' ? periodData.today : 
                         period === 'weekly' ? periodData.thisWeek :
                         periodData.thisMonth;
          const previous = period === 'daily' ? periodData.yesterday :
                          period === 'weekly' ? periodData.lastWeek :
                          periodData.lastMonth;
          
          if (!current || !previous) return null;
          
          const revenueChange = calculateChange(current.revenue, previous.revenue);
          const ordersChange = calculateChange(current.orders, previous.orders);
          const ticketChange = calculateChange(current.averageTicket, previous.averageTicket);

          return (
            <div
              key={period}
              className="p-3 sm:p-4 rounded-lg bg-muted/50 border border-border/50"
            >
              <h4 className="text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">
                {periodLabels[period].current} vs {periodLabels[period].previous}
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Receita</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-semibold">
                      {formatCurrency(current.revenue)}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-[10px] sm:text-xs font-medium",
                        getTrendColor(getTrend(revenueChange))
                      )}
                    >
                      {getTrendIcon(getTrend(revenueChange))}
                      {Math.abs(revenueChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Pedidos</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-semibold">
                      {current.orders}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-[10px] sm:text-xs font-medium",
                        getTrendColor(getTrend(ordersChange))
                      )}
                    >
                      {getTrendIcon(getTrend(ordersChange))}
                      {Math.abs(ordersChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    Ticket Médio
                  </span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-semibold">
                      {formatCurrency(current.averageTicket)}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-[10px] sm:text-xs font-medium",
                        getTrendColor(getTrend(ticketChange))
                      )}
                    >
                      {getTrendIcon(getTrend(ticketChange))}
                      {Math.abs(ticketChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
