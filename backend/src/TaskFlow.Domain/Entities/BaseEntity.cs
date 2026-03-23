namespace TaskFlow.Domain.Entities;

/// <summary>
/// Tüm entity'lerin miras alacağı base class.
/// Ortak alanları (Id, tarihler) tek yerde tanımlıyoruz ki tekrar etmeyelim.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
