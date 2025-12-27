using Aero_comidas.Models;

namespace Aero_comidas.Repositories.Interfaces;

/// <summary>
/// Interface específica para operações de Order
/// Estende operações genéricas com queries específicas de pedidos
/// </summary>
public interface IOrderRepository : IRepository<Order>
{
    Task<IEnumerable<Order>> GetOrdersByTableIdAsync(int tableId);
    Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status);
    Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<Order?> GetOrderWithItemsAsync(int orderId);
    Task<int> GetNextQueuePositionAsync();
    Task<IEnumerable<Order>> GetActiveOrdersAsync();
}
