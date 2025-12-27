using Microsoft.EntityFrameworkCore;
using Aero_comidas.Models;
using Aero_comidas.Repositories.Interfaces;
using Aero_comidas.Data;

namespace Aero_comidas.Repositories;

/// <summary>
/// Repository específico para Table
/// </summary>
public class TableRepository : Repository<Table>, ITableRepository
{
    public TableRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Table>> GetAvailableTablesAsync()
    {
        return await _dbSet
            .Where(t => t.Status == TableStatus.Disponivel)
            .OrderBy(t => t.TableNumber)
            .ToListAsync();
    }

    public async Task<IEnumerable<Table>> GetTablesByStatusAsync(TableStatus status)
    {
        return await _dbSet
            .Where(t => t.Status == status)
            .OrderBy(t => t.TableNumber)
            .ToListAsync();
    }

    public async Task<Table?> GetTableByNumberAsync(int tableNumber)
    {
        return await _dbSet
            .FirstOrDefaultAsync(t => t.TableNumber == tableNumber);
    }

    public async Task<Table?> GetTableWithOrdersAsync(int tableId)
    {
        return await _dbSet
            .Include(t => t.Orders)
            .FirstOrDefaultAsync(t => t.Id == tableId);
    }

    public async Task<bool> HasActiveOrdersAsync(int tableId)
    {
        return await _context.Orders
            .AnyAsync(o => o.TableId == tableId && 
                          (o.Status == OrderStatus.Pendente || 
                           o.Status == OrderStatus.Preparando || 
                           o.Status == OrderStatus.Pronto));
    }
}
