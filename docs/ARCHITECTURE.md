# 🏗️ Arquitetura AeroComidas - Documentação Técnica

## Visão Geral

O AeroComidas foi refatorado seguindo padrões de arquitetura profissional Full Stack, implementando separação clara de responsabilidades e preparando o sistema para escalabilidade.

---

## 📂 Estrutura de Diretórios

### Backend (.NET 8 API)

```
backend/
├── Controllers/          # Endpoints da API REST
├── DTOs/                # Data Transfer Objects (camada de comunicação)
├── Models/              # Entidades do domínio (banco de dados)
├── Repositories/        # Camada de acesso a dados (Repository Pattern)
│   └── Interfaces/     # Contratos dos repositórios
├── Services/            # Lógica de negócio
├── Data/                # Contexto do banco e configurações EF Core
├── Middlewares/         # Middlewares customizados (logging, etc)
└── Migrations/          # Migrações do Entity Framework
```

### Frontend (React + TypeScript + Vite)

```
frontend/src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface (shadcn/ui)
│   ├── ProductCard.tsx # Card de produto (independente)
│   └── OrderModal.tsx  # Modal de pedido (independente)
├── pages/              # Páginas/Views da aplicação
│   ├── MenuPage.tsx   # Cardápio com identificação de mesa
│   └── ...            # Outros dashboards
├── services/           # Camada de comunicação com API
│   ├── api.client.ts  # Cliente HTTP base
│   ├── order.service.ts
│   ├── menu.service.ts
│   ├── table.service.ts
│   └── analytics.service.ts
├── types/              # Definições TypeScript
│   ├── order.types.ts
│   ├── menu.types.ts
│   ├── table.types.ts
│   └── analytics.types.ts
├── utils/              # Utilitários
│   ├── formatters.ts  # Formatação (datas, moeda)
│   ├── validators.ts  # Validações
│   └── mappers.ts     # Mapeamento de enums
└── hooks/              # Custom React Hooks
```

---

## 🎯 Padrões Arquiteturais Implementados

### 1. Repository Pattern (Backend)

**Objetivo**: Isolar a lógica de acesso a dados, facilitando:
- Testes unitários (mock de repositories)
- Troca de banco de dados (SQLite → MySQL) sem impacto nos Controllers
- Queries complexas organizadas em um único lugar

**Estrutura**:
```csharp
// Interface genérica
IRepository<T> : GetByIdAsync, GetAllAsync, AddAsync, UpdateAsync...

// Interfaces específicas
IOrderRepository : IRepository<Order>
  + GetOrdersByTableIdAsync(tableId)
  + GetActiveOrdersAsync()

// Implementações
OrderRepository : Repository<Order>, IOrderRepository
```

**Benefício**: Controllers não conhecem detalhes de como os dados são salvos/recuperados.

---

### 2. DTO Pattern (Backend)

**Objetivo**: Separar a representação de dados interna (Models) da externa (API).

**Vantagens**:
- **Segurança**: Não expõe campos sensíveis ou internos ao frontend
- **Flexibilidade**: API pode mudar sem alterar o banco de dados
- **Validação**: DTOs podem ter validações específicas para entrada de dados

**Exemplo**:
```csharp
// Model (interno - banco de dados)
public class Order {
    public int Id { get; set; }
    public List<OrderItem> Items { get; set; }
    // ... mais propriedades internas
}

// DTO de entrada (recebido do frontend)
public class CreateOrderDto {
    public int TableId { get; set; }
    public List<CreateOrderItemDto> Items { get; set; }
}

// DTO de saída (enviado ao frontend)
public class OrderResponseDto {
    public int Id { get; set; }
    public string Status { get; set; }
    public decimal TotalAmount { get; set; }
    // Apenas dados necessários
}
```

---

### 3. Service Layer (Backend)

**Objetivo**: Centralizar regras de negócio complexas.

**Serviços Criados**:
- **OrderService**: Validações de pedidos, cálculo de totais
- **AnalyticsService**: Processamento de dados para BI/Marketing
- **StripePaymentService**: Integração com pagamentos
- **EmailReportService**: Envio de relatórios

**Benefício**: Controllers ficam leves, apenas coordenando requests/responses.

---

### 4. Middleware Customizado (Backend)

**RequestLoggingMiddleware**: Registra todas as requisições com:
- Método HTTP e path
- Status code da resposta
- Tempo de execução
- Logs de erro em caso de exceção

**Uso**: Facilita debug e monitoring em produção.

---

### 5. API Services (Frontend)

**Objetivo**: Centralizar toda comunicação com o backend.

**Estrutura**:
```typescript
// Cliente HTTP base
apiClient.get<T>(endpoint)
apiClient.post<T>(endpoint, data)

// Serviços específicos
orderService.getAll()
orderService.create(dto)
menuService.getAvailable()
tableService.getByNumber(num)
analyticsService.getDashboard()
```

**Benefícios**:
- **Type Safety**: TypeScript valida tipos de entrada/saída
- **Reusabilidade**: Mesma função usada em vários componentes
- **Manutenção**: URL da API alterada em um único lugar
- **Error Handling**: Tratamento centralizado de erros

---

### 6. Type Safety (Frontend)

**Objetivo**: Prevenir erros em tempo de compilação.

**Implementação**:
```typescript
// Tipos espelham os DTOs do backend
export interface Order {
    id: number;
    tableId: number;
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
}

export enum OrderStatus {
    Pendente = 0,
    Preparando = 1,
    Pronto = 2,
    Entregue = 3,
    Cancelado = 4
}
```

**Benefício**: IDE autocompleta propriedades e detecta erros antes da execução.

---

### 7. Component Isolation (Frontend)

**Objetivo**: Componentes visuais independentes da lógica de negócio.

**Exemplo**:
```typescript
// ProductCard.tsx - apenas visual
<ProductCard 
    item={menuItem} 
    onAddToCart={handleAdd}
/>

// Lógica de negócio fica na página/container
```

**Benefício**: Trocar tema/CSS não afeta funcionalidade; pode reusar em diferentes contextos.

---

## 🔄 Fluxo de Dados

### Exemplo: Criar Pedido

**Frontend → Backend**:
```
1. Usuário clica "Fazer Pedido" em MenuPage (páginas)
2. MenuPage chama orderService.create(dto)
3. orderService usa apiClient.post('/api/orders', dto)
4. Requisição HTTP POST enviada ao backend
```

**Backend Processing**:
```
5. OrdersController recebe CreateOrderDto
6. Controller chama OrderService.CreateOrderAsync(dto)
7. OrderService valida dados, calcula total
8. OrderService chama OrderRepository.AddAsync(order)
9. Repository persiste no banco via EF Core
10. Controller retorna OrderResponseDto ao frontend
```

**Backend → Frontend**:
```
11. Frontend recebe OrderResponseDto tipado
12. MenuPage atualiza UI com pedido criado
```

---

## 📊 Identificação de Mesa (Marketing/Analytics)

### Roteamento Dinâmico

**URL Pattern**: `/mesa/:tableId/cardapio`

**Exemplo**: `http://localhost:5173/mesa/5/cardapio`

**Fluxo**:
1. Cliente escaneia QR Code com URL da mesa
2. Frontend extrai `tableId` do parâmetro de rota
3. Todos os pedidos criados ficam associados à mesa
4. AnalyticsService processa dados por mesa:
   - Produtos mais pedidos por mesa
   - Receita por localização
   - Padrões de consumo

**Benefício para Negócio**:
- Saber quais mesas geram mais receita
- Identificar produtos populares por região do restaurante
- Otimizar layout baseado em dados
- Segmentação de marketing por preferências de mesa

---

## 🔧 Configurações

### Backend - appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=Aero_comidas.db"
  }
}
```

**Trocar para MySQL**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=aerocomidas;User=root;Password=senha;"
  }
}
```

Alterar em `Program.cs`:
```csharp
// De:
options.UseSqlite(connectionString)

// Para:
options.UseMySQL(connectionString)
```

### Frontend - .env

```env
VITE_API_URL=/api
```

Em produção:
```env
VITE_API_URL=https://api.aerocomidas.com
```

---

## 🧪 Testes

### Exemplo de Teste com Repository Pattern

```csharp
public class OrderServiceTests
{
    [Fact]
    public async Task CreateOrder_ShouldCalculateTotalCorrectly()
    {
        // Arrange
        var mockRepo = new Mock<IOrderRepository>();
        var service = new OrderService(mockRepo.Object);
        
        var dto = new CreateOrderDto {
            TableId = 1,
            Items = new List<CreateOrderItemDto> {
                new() { ProductName = "Pizza", Quantity = 2, UnitPrice = 50 }
            }
        };
        
        // Act
        var result = await service.CreateOrderAsync(dto);
        
        // Assert
        Assert.Equal(100, result.TotalAmount);
    }
}
```

---

## 📈 Escalabilidade

### Benefícios da Arquitetura Atual

1. **Troca de Banco**: Repository Pattern permite migrar SQLite → MySQL alterando apenas configuração
2. **Microserviços**: Services podem ser extraídos para APIs separadas
3. **Cache**: Repositórios podem implementar cache sem afetar Controllers
4. **Load Balancing**: Frontend estático pode ser servido de CDN
5. **CI/CD**: Estrutura clara facilita pipelines de deploy

### Próximos Passos Sugeridos

- [ ] Implementar cache com Redis nos Repositories
- [ ] Adicionar autenticação JWT
- [ ] Extrair AnalyticsService para microsserviço separado
- [ ] Implementar rate limiting no backend
- [ ] Adicionar testes unitários para Services e Repositories
- [ ] Configurar Docker para desenvolvimento e produção

---

## 📚 Referências

- [Repository Pattern - Martin Fowler](https://martinfowler.com/eaaCatalog/repository.html)
- [DTO Pattern](https://martinfowler.com/eaaCatalog/dataTransferObject.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Best Practices](https://react.dev/learn/thinking-in-react)

---

**Autor**: Refatoração Arquitetural AeroComidas  
**Data**: Dezembro 2025  
**Versão**: 2.0.0
