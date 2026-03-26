# Yeni Entity Ekleme Rehberi

> TaskFlow'a yeni bir entity eklemek için adım adım izlenmesi gereken yol.

---

## Adımlar

### 1. Domain Entity Oluştur

**Dosya:** `backend/src/TaskFlow.Domain/Entities/{EntityName}.cs`

```csharp
namespace TaskFlow.Domain.Entities;

public class Notification : BaseEntity
{
    public required string Title { get; set; }
    public string? Message { get; set; }
    public bool IsRead { get; set; } = false;

    // Foreign Key
    public Guid UserId { get; set; }

    // Navigation Property
    public User User { get; set; } = null!;
}
```

**Kurallar:**
- `BaseEntity`'den türet (Id, CreatedAt, UpdatedAt, soft delete otomatik gelir)
- `required` keyword ile zorunlu alanları belirt
- Navigation property'lerde `= null!;` kullan (EF Core dolduracak)
- FK property adı: `{NavigationName}Id`

---

### 2. Entity Configuration Oluştur (Fluent API)

**Dosya:** `backend/src/TaskFlow.Infrastructure/Data/Configurations/{EntityName}Configuration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(n => n.Id);

        builder.Property(n => n.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(n => n.Message)
            .HasColumnType("text");

        // İlişki tanımı
        builder.HasOne(n => n.User)
            .WithMany()  // User'da navigation yoksa
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

**Kurallar:**
- `HasMaxLength` ile string alanları sınırla
- Uzun text'ler için `HasColumnType("text")`
- `OnDelete` davranışını bilinçli seç (Cascade / Restrict / SetNull)
- Enum default value'larda enum sabitini kullan, int literal değil

---

### 3. DbContext'e DbSet Ekle

**Dosya:** `backend/src/TaskFlow.Infrastructure/Data/AppDbContext.cs`

```csharp
public DbSet<Notification> Notifications => Set<Notification>();
```

**Soft delete query filter (OnModelCreating'e ekle):**
```csharp
modelBuilder.Entity<Notification>().HasQueryFilter(e => !e.IsDeleted);
```

---

### 4. Migration Oluştur

```bash
cd backend
dotnet ef migrations add AddNotification \
  --project src/TaskFlow.Infrastructure \
  --startup-project src/TaskFlow.API \
  --output-dir Data/Migrations
```

Migration dosyasını kontrol et: oluşan SQL mantıklı mı?

---

### 5. Migration'ı Uygula

```bash
dotnet ef database update --startup-project src/TaskFlow.API
```

pgAdmin'den tabloyu kontrol et.

---

### 6. Repository Interface (Gerekirse)

Eğer generic CRUD yeterli değilse, entity-specific repository oluştur:

**Dosya:** `backend/src/TaskFlow.Application/Interfaces/INotificationRepository.cs`

```csharp
namespace TaskFlow.Application.Interfaces;

public interface INotificationRepository : IGenericRepository<Notification>
{
    Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(Guid userId);
}
```

---

### 7. Repository Implementation

**Dosya:** `backend/src/TaskFlow.Infrastructure/Repositories/NotificationRepository.cs`

```csharp
namespace TaskFlow.Infrastructure.Repositories;

public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
{
    public NotificationRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(Guid userId)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }
}
```

---

### 8. DI'a Kaydet

**Dosya:** `backend/src/TaskFlow.Infrastructure/Extensions/ServiceCollectionExtensions.cs`

```csharp
services.AddScoped<INotificationRepository, NotificationRepository>();
```

---

### 9. DTO'lar, Service, Controller (Faz 3-4'te)

Bu adımlar API endpoint'leri yazılırken tamamlanacak. Sırası:
1. DTO'lar: `CreateNotificationRequest`, `NotificationResponse`
2. Service: `INotificationService` → `NotificationService`
3. Controller: `NotificationsController`

---

## Checklist

Yeni entity eklerken kontrol listesi:

- [ ] Entity class oluşturuldu (`Domain/Entities/`)
- [ ] BaseEntity'den türetildi
- [ ] Entity Configuration yazıldı (`Infrastructure/Data/Configurations/`)
- [ ] DbSet eklendi (`AppDbContext`)
- [ ] Query filter eklendi (soft delete)
- [ ] Migration oluşturuldu ve kontrol edildi
- [ ] `dotnet build` başarılı
- [ ] Migration uygulandı (veritabanı varsa)
- [ ] Repository interface (gerekiyorsa)
- [ ] Repository implementation (gerekiyorsa)
- [ ] DI kaydı yapıldı
