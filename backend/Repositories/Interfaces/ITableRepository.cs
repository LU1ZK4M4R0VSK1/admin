using Aero_comidas.Models;

namespace Aero_comidas.Repositories.Interfaces;

/// <summary>
/// Interface específica para operações de Table
/// </summary>
public interface ITableRepository : IRepository<Table>
{
    Task<IEnumerable<Table>> GetAvailableTablesAsync();
    Task<IEnumerable<Table>> GetTablesByStatusAsync(TableStatus status);
    Task<Table?> GetTableByNumberAsync(int tableNumber);
    Task<Table?> GetTableWithOrdersAsync(int tableId);
    Task<bool> HasActiveOrdersAsync(int tableId);
}
