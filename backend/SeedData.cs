using Aero_comidas.Data;
using Aero_comidas.Models;
using Microsoft.EntityFrameworkCore;

namespace Aero_comidas;

public static class SeedData
{
    public static async Task Initialize(ApplicationDbContext context)
    {
        // Garante que o banco está criado
        await context.Database.EnsureCreatedAsync();

        // Verifica se já existe dados
        if (await context.MenuItems.AnyAsync())
        {
            return; // Já tem dados
        }

        Console.WriteLine("Populando banco de dados com dados de teste...");

        // Adiciona itens do cardápio
        var menuItems = new[]
        {
            new MenuItem { Name = "Hambúrguer Clássico", Description = "Pão, carne, queijo, alface e tomate", Price = 25.90m, Category = "Lanches", IsAvailable = true },
            new MenuItem { Name = "Pizza Margherita", Description = "Molho de tomate, mussarela e manjericão", Price = 45.00m, Category = "Pizzas", IsAvailable = true },
            new MenuItem { Name = "Refrigerante Lata", Description = "Coca-Cola, Guaraná ou Sprite", Price = 5.00m, Category = "Bebidas", IsAvailable = true },
            new MenuItem { Name = "Batata Frita", Description = "Porção de batatas fritas crocantes", Price = 15.00m, Category = "Porções", IsAvailable = true },
            new MenuItem { Name = "Salada Caesar", Description = "Alface, frango, croutons e molho caesar", Price = 28.00m, Category = "Saladas", IsAvailable = true }
        };

        await context.MenuItems.AddRangeAsync(menuItems);
        await context.SaveChangesAsync();

        Console.WriteLine($"✓ {menuItems.Length} itens do cardápio adicionados");

        // Adiciona mesas
        var tables = new[]
        {
            new Table { TableNumber = 1, Capacity = 4, Status = TableStatus.Disponivel },
            new Table { TableNumber = 2, Capacity = 2, Status = TableStatus.Disponivel },
            new Table { TableNumber = 3, Capacity = 6, Status = TableStatus.Disponivel },
            new Table { TableNumber = 4, Capacity = 4, Status = TableStatus.Disponivel },
            new Table { TableNumber = 5, Capacity = 2, Status = TableStatus.Disponivel }
        };

        await context.Tables.AddRangeAsync(tables);
        await context.SaveChangesAsync();

        Console.WriteLine($"✓ {tables.Length} mesas adicionadas");

        // Adiciona alguns pedidos de exemplo
        var orders = new[]
        {
            new Order
            {
                TableId = 1,
                Status = OrderStatus.Entregue,
                CreatedAt = DateTime.Now.AddHours(-2),
                TotalAmount = 70.90m,
                Items = new List<OrderItem>
                {
                    new OrderItem { Quantity = 2, UnitPrice = 25.90m, ProductName = "Hambúrguer Clássico" },
                    new OrderItem { Quantity = 3, UnitPrice = 5.00m, ProductName = "Refrigerante Lata" },
                    new OrderItem { Quantity = 1, UnitPrice = 15.00m, ProductName = "Batata Frita" }
                }
            },
            new Order
            {
                TableId = 2,
                Status = OrderStatus.EmAndamento,
                CreatedAt = DateTime.Now.AddMinutes(-30),
                TotalAmount = 45.00m,
                Items = new List<OrderItem>
                {
                    new OrderItem { Quantity = 1, UnitPrice = 45.00m, ProductName = "Pizza Margherita" }
                }
            },
            new Order
            {
                TableId = 3,
                Status = OrderStatus.Entregue,
                CreatedAt = DateTime.Now.AddHours(-1),
                TotalAmount = 71.00m,
                Items = new List<OrderItem>
                {
                    new OrderItem { Quantity = 2, UnitPrice = 28.00m, ProductName = "Salada Caesar" },
                    new OrderItem { Quantity = 2, UnitPrice = 5.00m, ProductName = "Refrigerante Lata" },
                    new OrderItem { Quantity = 1, UnitPrice = 15.00m, ProductName = "Batata Frita" }
                }
            }
        };

        await context.Orders.AddRangeAsync(orders);
        await context.SaveChangesAsync();

        Console.WriteLine($"✓ {orders.Length} pedidos de exemplo adicionados");
        Console.WriteLine("✓ Banco de dados populado com sucesso!");
    }
}
