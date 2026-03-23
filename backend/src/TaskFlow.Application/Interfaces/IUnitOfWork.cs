namespace TaskFlow.Application.Interfaces;

/// <summary>
/// Unit of Work pattern - birden fazla repository işlemini tek transaction'da toplar.
/// Örnek: Task oluştur + ActivityLog yaz → ikisi de başarılı olursa commit, biri başarısızsa rollback.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
