using Microsoft.EntityFrameworkCore;
using Aero_comidas.Models;
using Aero_comidas.Repositories.Interfaces;
using Aero_comidas.Data;

namespace Aero_comidas.Repositories;

/// <summary>
/// Repository específico para MenuItem
/// </summary>
public class MenuItemRepository : Repository<MenuItem>, IMenuItemRepository
{
    public MenuItemRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MenuItem>> GetAvailableItemsAsync()
    {
        return await _dbSet
            .Where(m => m.IsAvailable)
            .OrderBy(m => m.Category)
            .ThenBy(m => m.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuItem>> GetItemsByCategoryAsync(string category)
    {
        return await _dbSet
            .Where(m => m.Category == category && m.IsAvailable)
            .OrderBy(m => m.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<MenuItem>> GetTopSellingItemsAsync(int limit)
    {
        return await _dbSet
            .Where(m => m.IsAvailable)
            .OrderByDescending(m => m.TimesOrdered)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetAllCategoriesAsync()
    {
        return await _dbSet
            .Where(m => !string.IsNullOrEmpty(m.Category))
            .Select(m => m.Category!)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
    }

    public async Task IncrementTimesOrderedAsync(int itemId)
    {
        var item = await GetByIdAsync(itemId);
        if (item != null)
        {
            item.TimesOrdered++;
            await UpdateAsync(item);
        }
    }
}
