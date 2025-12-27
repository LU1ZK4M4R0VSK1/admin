import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon?: ReactNode;
}

export function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success bg-success/10";
      case "down":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="group bg-card rounded-lg border border-border p-5 card-shadow hover:card-shadow-hover transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {icon && (
              <span className="text-muted-foreground">{icon}</span>
            )}
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </span>
            {change !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  getTrendColor()
                )}
              >
                {getTrendIcon()}
                {Math.abs(change).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
