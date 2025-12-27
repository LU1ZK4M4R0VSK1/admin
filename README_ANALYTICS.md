# 🍽️ AeroComidas - Sistema Multi-Restaurante

Sistema completo de gerenciamento para restaurantes com **arquitetura White-Label reutilizável**.

[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-blue)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-blue)](https://recharts.org/)

---

## 🎯 **Arquitetura "Coringa" (White-Label)**

Este projeto permite que **qualquer restaurante** use o mesmo código com personalizações via configuração.

### ✨ Features Principais

- 📊 **Analytics Dashboard** - Visualização de vendas em tempo real
- 🍽️ **Gerenciamento de Cardápio** - CRUD completo de itens
- 📋 **Sistema de Pedidos** - Gestão de pedidos e status
- 🪑 **Controle de Mesas** - Organização de mesas e ocupação
- 💳 **Pagamentos** - Integração com Stripe
- 🎨 **Branding Personalizável** - Cores, logo, nome via `.env`
- 🌍 **Multi-idioma** - Suporte a pt-BR, en-US, es-ES
- 📱 **Responsivo** - Mobile-first design

---

## 🏗️ Arquitetura

```
├── backend/                    # ASP.NET Core API
│   ├── Controllers/
│   │   ├── AnalyticsController.cs
│   │   ├── MenuController.cs
│   │   ├── OrdersController.cs
│   │   └── TablesController.cs
│   ├── Models/
│   ├── Services/
│   └── Migrations/
│
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── config/
│   │   │   └── restaurant.config.ts  # ⭐ Configuração principal
│   │   │
│   │   ├── features/
│   │   │   └── analytics/            # Módulo Analytics
│   │   │       ├── components/       # UI (Recharts)
│   │   │       ├── hooks/            # React Query
│   │   │       ├── services/         # API calls
│   │   │       ├── types/            # TypeScript
│   │   │       └── utils/            # Helpers
│   │   │
│   │   ├── components/
│   │   │   └── layout/
│   │   ├── pages/
│   │   │   ├── Index.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── MenuManagement.tsx
│   │   │   └── KitchenDashboard.tsx
│   │   │
│   │   └── lib/
│   │       └── api.ts
│   │
│   ├── .env.example
│   └── .env
│
└── docs/
    ├── MULTI_TENANT_ARCHITECTURE.md  # Arquitetura detalhada
    ├── QUICK_SETUP_GUIDE.md          # Setup rápido
    └── USAGE_GUIDE.md                # Guia de uso
```

---

## 🚀 Quick Start

### **Pré-requisitos**

- Node.js 18+
- .NET 8.0 SDK
- Git

### **1. Clonar Repositório**

```bash
git clone <repo-url> MeuRestaurante
cd MeuRestaurante
```

### **2. Backend**

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
# Rodando em http://localhost:5000
```

### **3. Frontend**

```bash
cd frontend
npm install
cp .env.example .env
# Editar .env com suas configurações
npm run dev
# Rodando em http://localhost:5173
```

---

## 🔧 Configuração para Novo Restaurante

### **Editar `.env` no frontend:**

```env
# INFORMAÇÕES DO RESTAURANTE
VITE_RESTAURANT_NAME=Pizzaria Bella
VITE_RESTAURANT_SLUG=pizzaria-bella
VITE_RESTAURANT_LOGO=/logo.png

# CORES DA MARCA
VITE_PRIMARY_COLOR=#e74c3c
VITE_SECONDARY_COLOR=#c0392b

# API
VITE_API_URL=http://localhost:5000

# FEATURES ATIVAS
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_ORDERS=true
VITE_FEATURE_MENU=true
VITE_FEATURE_TABLES=true
VITE_FEATURE_PAYMENTS=true

# LOCALIZAÇÃO
VITE_LOCALE=pt-BR
VITE_CURRENCY=BRL
```

### **Adicionar Logo**

```bash
cp seu-logo.png frontend/public/logo.png
```

### **Pronto!** 🎉

Recarregue a página e seu restaurante estará configurado com cores, logo e nome personalizados.

---

## 📊 Módulo Analytics

### **Componentes Visuais**

- `MetricCard` - Cards de KPI (receita, pedidos, ticket médio)
- `RevenueChart` - Gráfico de receita diária (Recharts)
- `TopSellingItems` - Ranking de produtos mais vendidos
- `HourlyActivity` - Gráfico de vendas por hora
- `PeriodComparison` - Comparação temporal (hoje vs ontem, etc)
- `DateRangeFilter` - Filtro de período

### **Hooks React Query**

```typescript
// Exemplo de uso
import { useAnalyticsDashboard } from '@/features/analytics/hooks';

function MyDashboard() {
  const { data, isLoading } = useAnalyticsDashboard({
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  });
  
  return <div>{data?.summary.totalRevenue}</div>;
}
```

### **API Endpoints**

```
GET /api/analytics/dashboard          - Dados gerais do dashboard
GET /api/analytics/average-ticket     - Ticket médio
GET /api/analytics/top-selling-items  - Itens mais vendidos
GET /api/analytics/sales-by-hour      - Vendas por hora
GET /api/analytics/comparison         - Comparação de períodos
```

---

## 🎨 Personalização de Tema

### **Cores Customizadas**

O sistema usa CSS Variables que são definidas via `.env`:

```env
VITE_PRIMARY_COLOR=#ff6b35
VITE_SECONDARY_COLOR=#f7931e
```

Cores disponíveis:
- `--primary` - Cor principal (botões, links)
- `--secondary` - Cor secundária (destaques)
- `--success` - Verde (indicadores positivos)
- `--destructive` - Vermelho (alertas)

### **Helpers de Formatação**

```typescript
import { formatCurrency, formatNumber } from '@/config/restaurant.config';

formatCurrency(1000)         // R$ 1.000,00
formatCurrencyCompact(15000) // R$ 15 mil
formatNumber(1234)           // 1.234
```

---

## 📖 Documentação Completa

- 📘 [Arquitetura Multi-Tenant](docs/MULTI_TENANT_ARCHITECTURE.md) - Detalhes da arquitetura coringa
- 🚀 [Guia de Setup Rápido](docs/QUICK_SETUP_GUIDE.md) - Passo a passo completo
- 📗 [Guia de Uso](docs/USAGE_GUIDE.md) - Como usar o sistema
- 🧪 [Guia de Testes](TESTING_GUIDE.md) - Testes e validações
- 📝 [Próximos Passos](NEXT_STEPS.md) - Roadmap

---

## 🌟 Exemplos de Uso

### **Restaurante Italiano**

```env
VITE_RESTAURANT_NAME=Trattoria Roma
VITE_PRIMARY_COLOR=#d32f2f
VITE_SECONDARY_COLOR=#c62828
VITE_LOCALE=pt-BR
```

### **Sushi Bar Japonês**

```env
VITE_RESTAURANT_NAME=Sushi Yamato
VITE_PRIMARY_COLOR=#ff4081
VITE_SECONDARY_COLOR=#f50057
VITE_LOCALE=pt-BR
```

### **Hambúrgueria Americana**

```env
VITE_RESTAURANT_NAME=Burger House
VITE_PRIMARY_COLOR=#ffa000
VITE_SECONDARY_COLOR=#ff6f00
VITE_LOCALE=en-US
VITE_CURRENCY=USD
```

---

## 🛠️ Stack Tecnológica

### **Backend**
- ASP.NET Core 8.0
- Entity Framework Core
- SQLite / SQL Server / PostgreSQL
- Swagger para documentação

### **Frontend**
- React 18.3
- TypeScript 5.2
- Vite 5.0
- TanStack React Query
- Recharts (gráficos)
- Tailwind CSS
- shadcn/ui (componentes)
- Axios

### **Integrações**
- Stripe (pagamentos)
- Resend (emails)
- Date-fns (datas)

---

## 📦 Scripts Disponíveis

### **Backend**

```bash
dotnet run                    # Rodar em desenvolvimento
dotnet build                  # Build do projeto
dotnet ef migrations add ...  # Nova migração
dotnet ef database update     # Aplicar migrações
```

### **Frontend**

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # Lint do código
```

---

## 🚀 Deploy

### **Backend (Azure/AWS)**

```bash
cd backend
dotnet publish -c Release -o ./publish
# Deploy da pasta publish/
```

### **Frontend (Vercel/Netlify)**

```bash
cd frontend
npm run build
# Deploy da pasta dist/
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add NovaFeature'`)
4. Push para branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

## 🆘 Suporte

- 📧 Email: suporte@aerocomidas.com
- 💬 Issues: [GitHub Issues](https://github.com/...)
- 📚 Docs: [Documentação Completa](docs/)

---

## ✅ Checklist de Features

- [x] Sistema de Pedidos
- [x] Gerenciamento de Cardápio
- [x] Controle de Mesas
- [x] Analytics Dashboard
- [x] Integração Stripe
- [x] Arquitetura Multi-Tenant
- [x] Tema Personalizável
- [x] Responsivo (Mobile)
- [ ] Sistema de Delivery
- [ ] App Mobile (React Native)
- [ ] Relatórios PDF
- [ ] Integração WhatsApp

---

**Desenvolvido com ❤️ para a comunidade de restaurantes**
