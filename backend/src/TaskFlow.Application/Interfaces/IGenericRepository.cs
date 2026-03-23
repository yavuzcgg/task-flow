using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Interfaces;

/// <summary>
/// Generic repository interface - tüm entity'ler için ortak CRUD işlemleri.
/// Application katmanında tanımlanır, Infrastructure katmanında implement edilir.
/// Bu "Dependency Inversion" prensibinin ta kendisi.
/// </summary>
public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}
