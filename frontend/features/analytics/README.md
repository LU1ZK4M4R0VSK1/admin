# Analytics Module - README

## 📊 Estrutura do Módulo

```
features/analytics/
├── components/          # Componentes React (UI)
│   ├── MetricCard.tsx           # Card de KPI/métrica
│   ├── RevenueChart.tsx         # Gráfico de receita diária
│   ├── TopSellingItems.tsx      # Lista/gráfico de mais vendidos
│   ├── HourlyActivity.tsx       # Gráfico de atividade por hora
│   ├── PeriodComparison.tsx     # Comparação de períodos
│   ├── DateRangeFilter.tsx      # Filtro de datas
│   └── index.ts                 # Barrel export
│
├── hooks/              # Custom Hooks React Query
│   ├── useAnalyticsDashboard.ts # Dashboard geral
│   ├── useAverageTicket.ts      # Ticket médio
│   ├── useTopSellingItems.ts    # Itens mais vendidos
│   ├── useSalesByHour.ts        # Vendas por hora
│   ├── usePeriodComparison.ts   # Comparação de períodos
│   └── index.ts                 # Barrel export
│
├── services/           # API Service Layer
│   └── analyticsService.ts      # Chamadas HTTP à API
│
├── types/              # TypeScript Definitions
│   └── analytics.types.ts       # Tipos baseados na API
│
└── utils/              # Helper Functions
    └── chartHelpers.ts          # Formatação e cores
```

## 🔌 Endpoints da API

### 1. Dashboard Geral
```typescript
GET /api/analytics/dashboard?startDate=2025-01-01&endDate=2025-12-31
```
Retorna: receita total, pedidos, ticket médio, receita diária, status dos pedidos

### 2. Ticket Médio
```typescript
GET /api/analytics/average-ticket?startDate=2025-01-01&endDate=2025-12-31
```
Retorna: valor médio por pedido, total de pedidos, receita total

### 3. Itens Mais Vendidos
```typescript
GET /api/analytics/top-selling-items?startDate=2025-01-01&endDate=2025-12-31&limit=10
```
Retorna: lista de produtos com quantidade vendida e receita

### 4. Vendas por Hora
```typescript
GET /api/analytics/sales-by-hour?date=2025-12-20
```
Retorna: dados de vendas para cada hora do dia (0-23)

### 5. Comparação de Períodos
```typescript
GET /api/analytics/comparison
```
Retorna: comparações automáticas (hoje vs ontem, semana, mês)

## 🎯 Como Usar

### Importar e usar hooks:
```typescript
import { useAnalyticsDashboard, useTopSellingItems } from '@/features/analytics/hooks';

function MyComponent() {
  const { data, isLoading } = useAnalyticsDashboard({ 
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  });
  
  // data contém todos os dados tipados
}
```

### Importar componentes:
```typescript
import { MetricCard, RevenueChart } from '@/features/analytics/components';

<MetricCard title="Receita" value="R$ 10.000" />
<RevenueChart data={dailyRevenueData} />
```

### Usar helpers:
```typescript
import { formatCurrency, formatPercentage } from '@/features/analytics/utils/chartHelpers';

formatCurrency(1000) // "R$ 1.000,00"
formatPercentage(15.5) // "+15.50%"
```

## ⚡ Features Implementadas

✅ Estrutura de pastas modular  
✅ Tipos TypeScript completos  
✅ Service layer com Axios  
✅ Custom hooks com React Query  
✅ Cache automático (5-15 min)  
✅ Auto-refresh em tempo real  
✅ Helpers de formatação  
✅ Componentes shell (aguardando UI)  
✅ Página principal orquestrando tudo  

## 🎨 Próximos Passos

❌ Implementar UI dos componentes com Recharts  
❌ Estilizar com Tailwind + shadcn/ui  
❌ Adicionar animações e transições  
❌ Implementar exportação de relatórios  
❌ Adicionar testes unitários  

## 📝 Notas

- Todos os componentes são PLACEHOLDERS aguardando implementação visual
- A lógica de dados está 100% funcional
- React Query gerencia cache e loading states automaticamente
- Usar Lovable.dev para criar a interface visual baseada em referência
