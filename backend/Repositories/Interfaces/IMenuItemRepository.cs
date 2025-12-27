using Aero_comidas.Models;

namespace Aero_comidas.Repositories.Interfaces;

/// <summary>
/// Interface específica para operações de MenuItem
/// </summary>
public interface IMenuItemRepository : IRepository<MenuItem>
{
    Task<IEnumerable<MenuItem>> GetAvailableItemsAsync();
    Task<IEnumerable<MenuItem>> GetItemsByCategoryAsync(string category);
    Task<IEnumerable<MenuItem>> GetTopSellingItemsAsync(int limit);
    Task<IEnumerable<string>> GetAllCategoriesAsync();
    Task IncrementTimesOrderedAsync(int itemId);
}
