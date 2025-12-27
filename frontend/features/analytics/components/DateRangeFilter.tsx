import { useState } from "react";
import { format, subDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

const quickFilters = [
  { label: "Hoje", getRange: () => ({ start: new Date(), end: new Date() }) },
  {
    label: "Esta Semana",
    getRange: () => ({
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Este Mês",
    getRange: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    }),
  },
  {
    label: "Últimos 30 dias",
    getRange: () => ({
      start: subDays(new Date(), 30),
      end: new Date(),
    }),
  },
];

export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
}: DateRangeFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>("Últimos 30 dias");

  const handleQuickFilter = (filter: typeof quickFilters[0]) => {
    const { start, end } = filter.getRange();
    setActiveFilter(filter.label);
    onDateChange(start, end);
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "Selecionar";
    return format(date, "dd MMM yyyy", { locale: ptBR });
  };

  return (
    <div className="flex flex-col gap-3 bg-card rounded-lg border border-border p-2 sm:p-3 card-shadow">
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {quickFilters.map((filter) => (
          <Button
            key={filter.label}
            variant={activeFilter === filter.label ? "default" : "secondary"}
            size="sm"
            onClick={() => handleQuickFilter(filter)}
            className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 h-7 sm:h-8"
          >
            {filter.label}
          </Button>
        ))}
      </div>
      
      {/* Divider - Hidden on mobile */}
      <div className="h-px w-full bg-border sm:hidden" />
      
      {/* Date Pickers */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal text-[10px] sm:text-xs h-8 sm:h-9",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {formatDateDisplay(startDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => {
                setActiveFilter(null);
                onDateChange(date || null, endDate);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <span className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">até</span>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal text-[10px] sm:text-xs h-8 sm:h-9",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {formatDateDisplay(endDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate || undefined}
              onSelect={(date) => {
                setActiveFilter(null);
                onDateChange(startDate, date || null);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
