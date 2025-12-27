# Database Schema - AeroComidas Analytics

Este diretório contém os arquivos de schema e estrutura do banco de dados.

## Arquivo Copiado

### schema.sql
Contém o schema completo do banco de dados SQL Server incluindo:

- **Tables**
  - `MenuItems` - Itens do menu/cardápio
  - `Tables` - Mesas do restaurante
  - `Orders` - Pedidos realizados
  - `OrderItems` - Itens de cada pedido

- **Relationships**
  - Orders → Tables (FK_Orders_Tables)
  - OrderItems → Orders (FK_OrderItems_Orders)
  - OrderItems → MenuItems (FK_OrderItems_MenuItems)

- **Indexes**
  - Índices em campos de data para otimizar queries de analytics
  - Índices em campos de status e categoria

## Estrutura das Tabelas

### MenuItems
```sql
- Id (int, PK)
- Name (nvarchar(100))
- Description (nvarchar(500))
- Price (decimal(18,2))
- Category (nvarchar(50))
- ImageUrl (nvarchar(500))
- IsAvailable (bit)
- CreatedAt (datetime2)
- UpdatedAt (datetime2)
```

### Tables
```sql
- Id (int, PK)
- Number (int)
- Capacity (int)
- Status (nvarchar(20))
- IsActive (bit)
```

### Orders
```sql
- Id (int, PK)
- TableId (int, FK)
- Status (nvarchar(20))
- TotalAmount (decimal(18,2))
- CustomerName (nvarchar(100))
- CustomerEmail (nvarchar(100))
- CustomerPhone (nvarchar(20))
- Notes (nvarchar(500))
- PaymentMethod (nvarchar(50))
- PaymentStatus (nvarchar(20))
- CreatedAt (datetime2)
- UpdatedAt (datetime2)
- CompletedAt (datetime2, nullable)
```

### OrderItems
```sql
- Id (int, PK)
- OrderId (int, FK)
- MenuItemId (int, FK)
- Quantity (int)
- UnitPrice (decimal(18,2))
- Subtotal (decimal(18,2))
- Notes (nvarchar(500))
```

## Migrations (Entity Framework Core)

O projeto usa Entity Framework Core Code-First. As migrations estão localizadas em:
```
backend/Migrations/
```

### Migrations Disponíveis:
1. **20251220185429_AddMenuAndTables** - Criação inicial de Menu e Tables
2. **20251220193746_FixOrderItemModel** - Correção do modelo OrderItem

## Setup do Banco de Dados

### Opção 1: Usando Entity Framework Migrations (Recomendado)

```bash
cd backend
dotnet ef database update
```

### Opção 2: Executando o Script SQL

```bash
# SQL Server
sqlcmd -S localhost -d master -i schema.sql

# Ou via SQL Server Management Studio (SSMS)
```

## Connection String

Configure em `backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=AeroComidas;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### Alternativa com usuário/senha:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=AeroComidas;User Id=seu_usuario;Password=sua_senha;TrustServerCertificate=True"
  }
}
```

## Dados de Teste

Para popular o banco com dados iniciais:

```bash
cd backend
dotnet run --seed
```

Ou use o script PowerShell do projeto original:
```bash
.\populate-db.ps1
```

## Queries Úteis para Analytics

### Total de Vendas por Período
```sql
SELECT 
    CAST(CreatedAt AS DATE) as Date,
    COUNT(*) as TotalOrders,
    SUM(TotalAmount) as TotalRevenue
FROM Orders
WHERE Status = 'Completed'
  AND CreatedAt BETWEEN @StartDate AND @EndDate
GROUP BY CAST(CreatedAt AS DATE)
ORDER BY Date;
```

### Itens Mais Vendidos
```sql
SELECT TOP 10
    mi.Name,
    mi.Category,
    SUM(oi.Quantity) as TotalQuantity,
    SUM(oi.Subtotal) as TotalRevenue
FROM OrderItems oi
INNER JOIN MenuItems mi ON oi.MenuItemId = mi.Id
INNER JOIN Orders o ON oi.OrderId = o.Id
WHERE o.Status = 'Completed'
  AND o.CreatedAt BETWEEN @StartDate AND @EndDate
GROUP BY mi.Name, mi.Category
ORDER BY TotalQuantity DESC;
```

### Vendas por Hora do Dia
```sql
SELECT 
    DATEPART(HOUR, CreatedAt) as Hour,
    COUNT(*) as OrderCount,
    SUM(TotalAmount) as Revenue
FROM Orders
WHERE Status = 'Completed'
  AND CreatedAt BETWEEN @StartDate AND @EndDate
GROUP BY DATEPART(HOUR, CreatedAt)
ORDER BY Hour;
```

### Análise por Categoria
```sql
SELECT 
    mi.Category,
    COUNT(DISTINCT oi.OrderId) as Orders,
    SUM(oi.Quantity) as ItemsSold,
    SUM(oi.Subtotal) as Revenue
FROM OrderItems oi
INNER JOIN MenuItems mi ON oi.MenuItemId = mi.Id
INNER JOIN Orders o ON oi.OrderId = o.Id
WHERE o.Status = 'Completed'
  AND o.CreatedAt BETWEEN @StartDate AND @EndDate
GROUP BY mi.Category
ORDER BY Revenue DESC;
```

## Backup

### Criar Backup
```sql
BACKUP DATABASE AeroComidas 
TO DISK = 'C:\Backup\AeroComidas.bak'
WITH FORMAT;
```

### Restaurar Backup
```sql
RESTORE DATABASE AeroComidas 
FROM DISK = 'C:\Backup\AeroComidas.bak'
WITH REPLACE;
```

## Performance

- Índices otimizados para queries de analytics em campos de data
- Índices em campos de status para filtros comuns
- Índices em foreign keys para joins eficientes

## Data de Cópia

Copiado em: 27 de Dezembro de 2025
Origem: D:\Freelancer\Desenvolvimento de sites\templates\AeroComidas\database
