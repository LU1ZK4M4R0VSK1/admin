using System.Linq.Expressions;

namespace Aero_comidas.Repositories.Interfaces;

/// <summary>
/// Interface genérica para operações CRUD
/// Facilita testes unitários e permite trocar implementação (SQLite -> MySQL)
/// </summary>
public interface IRepository<T> where T : class
{
    // Queries
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
    
    // Commands
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
}
