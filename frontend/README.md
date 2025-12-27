# Analytics Dashboard - Frontend

Este diretório contém todos os arquivos do frontend relacionados ao dashboard de analytics do projeto AeroComidas.

## Estrutura Copiada

### Componentes Analytics (`src/features/analytics/components/`)
- `TopSellingItems.tsx` - Exibe os itens mais vendidos
- `RevenueChart.tsx` - Gráfico de receita
- `PeriodComparison.tsx` - Comparação entre períodos
- `MetricCard.tsx` - Cards de métricas
- `HourlyActivity.tsx` - Atividade por hora
- `DateRangeFilter.tsx` - Filtro de intervalo de datas
- `CategoryChart.tsx` - Gráfico por categoria
- `index.ts` - Exportações dos componentes

### Hooks (`src/features/analytics/hooks/`)
- `useTopSellingItems.ts` - Hook para itens mais vendidos
- `useSalesByHour.ts` - Hook para vendas por hora
- `usePeriodComparison.ts` - Hook para comparação de períodos
- `useAverageTicket.ts` - Hook para ticket médio
- `useAnalyticsDashboard.ts` - Hook principal do dashboard
- `index.ts` - Exportações dos hooks

### Serviços (`src/features/analytics/services/`)
- `analyticsService.ts` - Serviço de comunicação com API de analytics

### Tipos (`src/features/analytics/types/`)
- `analytics.types.ts` - Tipos TypeScript para analytics

### Utilitários (`src/features/analytics/utils/`)
- `chartHelpers.ts` - Funções auxiliares para gráficos

### Páginas (`src/pages/`)
- `AnalyticsDashboard.tsx` - Página principal do dashboard de analytics

### Arquivos de Suporte
- `src/lib/` - Utilitários gerais (shadcn/ui utils)
- `src/components/ui/` - Componentes UI do shadcn/ui
- `src/config/` - Configurações
- `src/utils/` - Utilitários diversos
- `src/types/analytics.types.ts` - Tipos globais de analytics
- `src/services/analytics.service.ts` - Serviço global de analytics

### Arquivos de Configuração
- `package.json` - Dependências do projeto
- `tsconfig.json` - Configuração TypeScript
- `vite.config.ts` - Configuração Vite
- `tailwind.config.ts` - Configuração Tailwind CSS
- `postcss.config.js` - Configuração PostCSS
- `components.json` - Configuração shadcn/ui
- `index.html` - HTML base

### Arquivos Raiz do src
- `main.tsx` - Ponto de entrada da aplicação
- `App.tsx` - Componente principal
- `index.css` - Estilos globais
- `vite-env.d.ts` - Declarações de tipos Vite

## Tecnologias Utilizadas

- **React + TypeScript** - Framework e linguagem
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Recharts** - Biblioteca de gráficos
- **React Query** - Gerenciamento de estado e cache
- **Axios** - Cliente HTTP

## Instalação

```bash
npm install
```

## Executar em Desenvolvimento

```bash
npm run dev
```

## Build para Produção

```bash
npm run build
```

## Features do Analytics Dashboard

1. **Métricas Principais**
   - Receita total
   - Número de pedidos
   - Ticket médio
   - Itens vendidos

2. **Gráficos**
   - Receita ao longo do tempo
   - Vendas por hora
   - Vendas por categoria
   - Comparação entre períodos

3. **Ranking**
   - Itens mais vendidos
   - Categorias mais populares

4. **Filtros**
   - Intervalo de datas customizável
   - Período de comparação

## Data de Cópia

Copiado em: 27 de Dezembro de 2025
Origem: D:\Freelancer\Desenvolvimento de sites\templates\AeroComidas\frontend
