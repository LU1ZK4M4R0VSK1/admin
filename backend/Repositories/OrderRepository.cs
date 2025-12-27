using Microsoft.EntityFrameworkCore;
using Aero_comidas.Models;
using Aero_comidas.Repositories.Interfaces;
using Aero_comidas.Data;

namespace Aero_comidas.Repositories;

/// <summary>
/// Repository específico para Order
/// Implementa queries complexas relacionadas a pedidos
/// </summary>
public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Order>> GetOrdersByTableIdAsync(int tableId)
    {
        return await _dbSet
            .Include(o => o.Items)
            .Where(o => o.TableId == tableId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status)
    {
        return await _dbSet
            .Include(o => o.Items)
            .Where(o => o.Status == status)
            .OrderBy(o => o.QueuePosition)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(o => o.Items)
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderWithItemsAsync(int orderId)
    {
        return await _dbSet
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId);
    }

    public async Task<int> GetNextQueuePositionAsync()
    {
        var maxPosition = await _dbSet
            .Where(o => o.Status == OrderStatus.Pendente || o.Status == OrderStatus.Preparando)
            .MaxAsync(o => (int?)o.QueuePosition);
        
        return (maxPosition ?? 0) + 1;
    }

    public async Task<IEnumerable<Order>> GetActiveOrdersAsync()
    {
        return await _dbSet
            .Include(o => o.Items)
            .Where(o => o.Status != OrderStatus.Entregue && o.Status != OrderStatus.Cancelado)
            .OrderBy(o => o.QueuePosition)
            .ToListAsync();
    }
}
