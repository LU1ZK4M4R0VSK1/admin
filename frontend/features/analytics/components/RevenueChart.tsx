import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

interface HourlyData {
  hour: number;
  orderCount: number;
  totalRevenue: number;
  averageTicket: number;
}

interface RevenueChartProps {
  data: HourlyData[];
  periodLabel?: string;
  height?: number;
}

export function RevenueChart({ 
  data, 
  periodLabel = "Todo o período", 
  height = 380 
}: RevenueChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Calcular valores máximos dinamicamente
  const maxRevenue = Math.max(...data.map(d => d.totalRevenue), 0);
  const maxOrders = Math.max(...data.map(d => d.orderCount), 0);
  
  // Arredondar para cima para valores mais limpos
  const maxRevenueRounded = Math.ceil(maxRevenue / 50) * 50;
  const maxOrdersRounded = Math.ceil(maxOrders * 1.2); // 20% a mais para espaço

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}h`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl border border-gray-700">
          <p className="font-semibold mb-2 text-sm">{formatHour(label)}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-gray-300">Receita:</span>
              <span className="font-semibold ml-auto">{formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-gray-300">Pedidos:</span>
              <span className="font-semibold ml-auto">{payload[1].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Legend */}
      <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6 mb-3 sm:mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
          <span className="text-xs sm:text-sm text-gray-600 font-medium">Receita</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500" />
          <span className="text-xs sm:text-sm text-gray-600 font-medium">Pedidos</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full -mx-2 sm:mx-0" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <ResponsiveContainer width="100%" height={isMobile ? 300 : height}>
          <BarChart 
            data={data} 
            margin={
              isMobile 
                ? { top: 5, right: 15, left: 10, bottom: 20 }
                : { top: 10, right: 30, left: 0, bottom: 40 }
            }
            barGap={2}
            barCategoryGap="12%"
          >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            vertical={false} 
          />
          
          <XAxis
            dataKey="hour"
            tickFormatter={formatHour}
            tick={{ fill: "#6b7280", fontSize: isMobile ? 9 : 11 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            interval={isMobile ? 5 : 2}
            minTickGap={isMobile ? 30 : 10}
          />
          
          <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={formatCurrency}
            tick={{ fill: "#6b7280", fontSize: isMobile ? 9 : 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, maxRevenueRounded]}
            width={isMobile ? 55 : 80}
            label={!isMobile ? { 
              value: 'Receita (R$)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#6b7280' }
            } : undefined}
          />
          
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#6b7280", fontSize: isMobile ? 9 : 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, maxOrdersRounded]}
            allowDecimals={false}
            width={isMobile ? 35 : 50}
            label={!isMobile ? { 
              value: 'Pedidos', 
              angle: 90, 
              position: 'insideRight',
              style: { fontSize: 12, fill: '#6b7280' }
            } : undefined}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Bar 
            yAxisId="left" 
            dataKey="totalRevenue" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
            maxBarSize={40}
          />
          
          <Bar 
            yAxisId="right" 
            dataKey="orderCount" 
            fill="#f59e0b" 
            radius={[8, 8, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
      </div>

      {/* Period Label */}
      <div className="text-center mt-2 sm:mt-3">
        <span className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-200">
          {periodLabel}
        </span>
      </div>
    </div>
  );
}
