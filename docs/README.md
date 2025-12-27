# Aero_comidas

Projeto Full Stack gerado automaticamente.

## 🚀 Tecnologias

### Frontend
- ⚡ Vite
- ⚛️ React
- 📘 TypeScript

### Backend
- 🔧 .NET 8
- 📦 Entity Framework Core
- 🗄️ SQLite

## 📦 Instalação e Execução

### Frontend
```bash
cd frontend
npm install        # Instala as dependências (só precisa fazer uma vez)
npm run dev        # Inicia o servidor de desenvolvimento
```

O frontend estará disponível em: **http://localhost:5173**

### Backend
```bash
cd backend
dotnet restore     # Restaura as dependências (só precisa fazer uma vez)
dotnet run         # Inicia a API
```

O backend estará disponível em: **http://localhost:5000**
Swagger UI: **http://localhost:5000/swagger**

### 🗄️ Database (Opcional)
Se quiser usar migrations do Entity Framework:
```bash
cd backend
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger

## � Documentação

### Guias Técnicos
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Arquitetura completa do sistema (Repository Pattern, DTOs, Services)
- [**SPA-ADMIN-GUIDE.md**](./SPA-ADMIN-GUIDE.md) - Guia completo do painel administrativo SPA
- [**MIGRATION_GUIDE.md**](./MIGRATION_GUIDE.md) - Guia de migração para novas arquiteturas
- [**QUICKSTART.md**](./QUICKSTART.md) - Início rápido para desenvolvedores

### Sistema Administrativo
O painel administrativo foi construído como uma **Single Page Application (SPA)** moderna com:
- ✅ Navegação lateral fixa (Sidebar)
- ✅ Dashboard em tempo real com métricas
- ✅ Design responsivo (desktop + mobile)
- ✅ 5 módulos integrados: Dashboard, Pedidos, Cardápio, Mesas, Analytics

Acesse: **http://localhost:5173/admin**

## 📝 Estrutura do Projeto

```
Aero_comidas/
├── frontend/          # Aplicação React
│   ├── src/
│   │   ├── components/    # Sidebar, AdminLayout, UI components
│   │   ├── pages/         # Dashboard, Kitchen, Menu, Tables, Analytics
│   │   ├── services/      # API clients (order, menu, table, analytics)
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Formatters, validators, mappers
├── backend/           # API .NET 8
│   ├── Controllers/       # API endpoints
│   ├── Services/          # Business logic layer
│   ├── Repositories/      # Data access layer
│   ├── DTOs/             # Data transfer objects
│   ├── Models/           # Domain entities
│   ├── Data/             # DbContext
│   └── Middlewares/      # Request logging
├── database/          # Scripts SQL e migrações
├── docs/              # Documentação técnica
└── Aero_comidas.sln   # Solution .NET
```

## 🤝 Contribuindo

Contribuições são bem-vindas!

## 📄 Licença

MIT
