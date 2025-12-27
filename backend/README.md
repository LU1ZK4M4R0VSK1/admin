# Analytics Backend - API .NET 8

Backend API em ASP.NET Core 8 para o sistema de Analytics do AeroComidas.

## Arquivos Copiados

### Controllers
- **AnalyticsController.cs** - Endpoints para dados de analytics
  - GET `/api/analytics/summary` - Resumo geral
  - GET `/api/analytics/revenue` - Receita por período
  - GET `/api/analytics/top-selling` - Itens mais vendidos
  - GET `/api/analytics/sales-by-hour` - Vendas por hora
  - GET `/api/analytics/category-analysis` - Análise por categoria
  - GET `/api/analytics/period-comparison` - Comparação entre períodos

### Services
- **AnalyticsService.cs** - Lógica de negócio de analytics
- **EmailReportService.cs** - Serviço de envio de relatórios por email

### DTOs (Data Transfer Objects)
- **AnalyticsDTOs.cs** - DTOs específicos de analytics
- **MenuItemDTOs.cs** - DTOs de itens do menu
- **OrderDTOs.cs** - DTOs de pedidos
- **TableDTOs.cs** - DTOs de mesas

### Models
- **MenuItem.cs** - Modelo de item do menu
- **Order.cs** - Modelo de pedido
- **OrderItem.cs** - Modelo de item do pedido
- **Table.cs** - Modelo de mesa

### Data
- **ApplicationDbContext.cs** - Contexto do Entity Framework Core

### Repositories
- **Repository.cs** - Repositório genérico base
- **MenuItemRepository.cs** - Repositório de itens do menu
- **OrderRepository.cs** - Repositório de pedidos
- **TableRepository.cs** - Repositório de mesas
- **Interfaces/** - Interfaces dos repositórios

### Migrations
- Todas as migrations do Entity Framework Core
- **ApplicationDbContextModelSnapshot.cs** - Snapshot do modelo

### Middlewares
- **RequestLoggingMiddleware.cs** - Middleware de logging de requisições

### Configuração
- **Backend.csproj** - Arquivo do projeto .NET
- **Program.cs** - Configuração e startup da aplicação
- **appsettings.json** - Configurações da aplicação
- **SeedData.cs** - Dados iniciais para popular o banco
- **Properties/launchSettings.json** - Configurações de execução

## Tecnologias

- **.NET 8.0**
- **ASP.NET Core Web API**
- **Entity Framework Core** - ORM
- **SQL Server** - Banco de dados
- **Swashbuckle** - Documentação OpenAPI/Swagger

## Dependências Principais

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" />
<PackageReference Include="Swashbuckle.AspNetCore" />
<PackageReference Include="Stripe.net" />
```

## Configuração

### 1. Configurar Connection String

Edite `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=AeroComidas;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### 2. Aplicar Migrations

```bash
dotnet ef database update
```

### 3. Popular com Dados Iniciais (Opcional)

```bash
dotnet run --seed
```

## Executar

### Desenvolvimento
```bash
dotnet run
```

### Build
```bash
dotnet build
```

### Publicação
```bash
dotnet publish -c Release
```

## Endpoints Principais

### Analytics

```
GET /api/analytics/summary?startDate={date}&endDate={date}
GET /api/analytics/revenue?startDate={date}&endDate={date}&groupBy={day|week|month}
GET /api/analytics/top-selling?startDate={date}&endDate={date}&limit={number}
GET /api/analytics/sales-by-hour?startDate={date}&endDate={date}
GET /api/analytics/category-analysis?startDate={date}&endDate={date}
GET /api/analytics/period-comparison?currentStart={date}&currentEnd={date}&previousStart={date}&previousEnd={date}
```

## Estrutura de Resposta Analytics

### Summary Response
```json
{
  "totalRevenue": 15000.50,
  "totalOrders": 250,
  "averageTicket": 60.00,
  "itemsSold": 500
}
```

### Revenue Response
```json
{
  "data": [
    {
      "date": "2025-12-27",
      "revenue": 1250.00,
      "orders": 25
    }
  ]
}
```

### Top Selling Response
```json
{
  "items": [
    {
      "itemId": 1,
      "itemName": "Pizza Margherita",
      "quantitySold": 45,
      "revenue": 1350.00
    }
  ]
}
```

## CORS

O backend está configurado para aceitar requisições do frontend em:
- `http://localhost:5173` (Vite dev server)
- Outras origens configuradas em `Program.cs`

## Logging

O middleware `RequestLoggingMiddleware` registra todas as requisições HTTP para análise e debugging.

## Data de Cópia

Copiado em: 27 de Dezembro de 2025
Origem: D:\Freelancer\Desenvolvimento de sites\templates\AeroComidas\backend
