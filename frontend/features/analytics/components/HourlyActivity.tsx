import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HourlyData {
  hour: number;
  orderCount: number;
  totalRevenue: number;
  averageTicket: number;
}

interface HourlyActivityProps {
  data: HourlyData[];
  peakHour: number;
}

export function HourlyActivity({ data, peakHour }: HourlyActivityProps) {
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}h`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5 card-shadow animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Atividade por Hora
        </h3>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          Pico: {formatHour(peakHour)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="hour"
            tickFormatter={formatHour}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, name: string) => {
              if (name === "orderCount") return [value, "Pedidos"];
              return [formatCurrency(value), "Receita"];
            }}
            labelFormatter={(label) => `${formatHour(label as number)}`}
          />
          <Bar dataKey="orderCount" radius={[3, 3, 0, 0]} maxBarSize={24}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.hour === peakHour
                    ? "hsl(var(--primary))"
                    : "hsl(var(--primary) / 0.4)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
