# 📊 Analytics Dashboard - Template Completo

Template completo e independente do sistema de Analytics extraído do projeto AeroComidas. Inclui frontend (React + TypeScript), backend (.NET 8) e estrutura de banco de dados (SQL Server).

## 📦 Conteúdo do Template

### 🎨 Frontend (`/frontend` e `/src`)
- **Framework**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Gráficos**: Recharts
- **State**: React Query
- **Total**: ~89 arquivos

### ⚙️ Backend (`/backend`)
- **Framework**: ASP.NET Core 8 Web API
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **Total**: 32 arquivos

### 🗄️ Database (`/database`)
- Schema SQL completo
- Migrations do Entity Framework
- Scripts de setup

### 📚 Documentação (`/docs`)
- Arquitetura do sistema
- Guias de uso
- Documentação da API

## 🚀 Quick Start

### 1️⃣ Backend Setup

```bash
cd backend

# Restaurar pacotes
dotnet restore

# Configurar connection string em appsettings.json
# "Server=localhost;Database=AeroComidas;Trusted_Connection=True;TrustServerCertificate=True"

# Aplicar migrations
dotnet ef database update

# Executar (opcional: --seed para dados de teste)
dotnet run
```

Backend estará rodando em: `https://localhost:7001`

### 2️⃣ Frontend Setup

```bash
# Instalar dependências
npm install

# Configurar API URL em src/config (se necessário)
# Atualizar VITE_API_URL

# Executar em desenvolvimento
npm run dev
```

Frontend estará disponível em: `http://localhost:5173`

## 📊 Features do Analytics

### Métricas Principais
- ✅ Receita Total
- ✅ Número de Pedidos
- ✅ Ticket Médio
- ✅ Total de Itens Vendidos

### Visualizações
- 📈 Gráfico de Receita ao longo do tempo
- ⏰ Vendas por hora do dia
- 🏷️ Análise por categoria
- 🔄 Comparação entre períodos
- 🏆 Top itens mais vendidos

### Filtros
- 📅 Intervalo de datas customizável
- 📊 Agrupamento (dia/semana/mês)
- 🔍 Filtros por categoria
- ⚖️ Comparação de períodos

## 🔌 API Endpoints

### Analytics Controller

```
GET /api/analytics/summary
    ?startDate=2025-12-01&endDate=2025-12-31

GET /api/analytics/revenue
    ?startDate=2025-12-01&endDate=2025-12-31&groupBy=day

GET /api/analytics/top-selling
    ?startDate=2025-12-01&endDate=2025-12-31&limit=10

GET /api/analytics/sales-by-hour
    ?startDate=2025-12-01&endDate=2025-12-31

GET /api/analytics/category-analysis
    ?startDate=2025-12-01&endDate=2025-12-31

GET /api/analytics/period-comparison
    ?currentStart=2025-12-01&currentEnd=2025-12-31
    &previousStart=2025-11-01&previousEnd=2025-11-30
```

## 📁 Estrutura do Projeto

```
Analytics/
├── frontend/                    # Configurações frontend (raiz)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── ...
├── src/                        # Código fonte frontend
│   ├── features/
│   │   └── analytics/
│   │       ├── components/     # Componentes React
│   │       ├── hooks/          # Custom hooks
│   │       ├── services/       # API calls
│   │       ├── types/          # TypeScript types
│   │       └── utils/          # Helpers
│   ├── pages/
│   │   └── AnalyticsDashboard.tsx
│   ├── components/ui/          # shadcn/ui components
│   ├── lib/                    # Utils gerais
│   └── config/                 # Configurações
├── backend/                    # API .NET
│   ├── Controllers/
│   │   └── AnalyticsController.cs
│   ├── Services/
│   │   ├── AnalyticsService.cs
│   │   └── EmailReportService.cs
│   ├── DTOs/
│   ├── Models/
│   ├── Data/
│   ├── Repositories/
│   ├── Migrations/
│   └── README.md
├── database/                   # Database schema
│   ├── schema.sql
│   └── README.md
└── docs/                       # Documentação
    ├── ARCHITECTURE.md
    └── README.md
```

## 🛠️ Tecnologias

### Frontend
- React 18
- TypeScript 5
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- React Query
- Axios
- date-fns

### Backend
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger/OpenAPI

## 📝 Personalização

### Alterar URL da API

Edite `src/config/api.ts` ou variável de ambiente:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001';
```

### Alterar Connection String

Edite `backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "sua-connection-string"
  }
}
```

### Alterar Cores/Tema

Edite `tailwind.config.ts` e `src/index.css`

### Adicionar Novas Métricas

1. Adicione endpoint em `AnalyticsController.cs`
2. Adicione método em `AnalyticsService.cs`
3. Crie DTO em `AnalyticsDTOs.cs`
4. Adicione hook em `src/features/analytics/hooks/`
5. Crie componente em `src/features/analytics/components/`

## 📊 Dados de Exemplo

Para popular o banco com dados de teste:

```bash
cd backend
dotnet run --seed
```

Ou use o script PowerShell (se disponível no projeto original):
```powershell
.\populate-db.ps1
```

## 🔒 Segurança

- Configure CORS adequadamente em `Program.cs`
- Use variáveis de ambiente para dados sensíveis
- Implemente autenticação/autorização conforme necessário
- Valide todos os inputs do usuário

## 📦 Build para Produção

### Frontend
```bash
npm run build
# Output em: dist/
```

### Backend
```bash
dotnet publish -c Release -o ./publish
# Output em: publish/
```

## 🎯 Casos de Uso

Este template é ideal para:
- ✅ Dashboards administrativos de restaurantes
- ✅ Sistemas de relatórios de vendas
- ✅ Análise de performance de produtos
- ✅ Monitoramento de métricas de negócio
- ✅ Comparação de períodos e tendências
- ✅ Base para sistemas de BI customizados

## 📈 Total de Arquivos

- **126 arquivos** no total
- Frontend: ~89 arquivos
- Backend: 32 arquivos
- Database: 2 arquivos
- Docs: 3 arquivos

## 📅 Informações da Cópia

**Data**: 27 de Dezembro de 2025  
**Origem**: D:\Freelancer\Desenvolvimento de sites\templates\AeroComidas  
**Versão**: .NET 8 + React 18  

## 📖 Documentação Adicional

- [Backend README](backend/README.md) - Detalhes da API
- [Database README](database/README.md) - Schema e queries
- [Analytics README](README_ANALYTICS.md) - Documentação original
- [Architecture](docs/ARCHITECTURE.md) - Arquitetura do sistema

## 🤝 Suporte

Para dúvidas sobre o template original, consulte a documentação em `/docs`.

---

**Pronto para usar!** 🚀 Basta seguir os passos do Quick Start acima.
