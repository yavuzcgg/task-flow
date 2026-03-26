# EF Core - Öğrenme Notları

> Entity Framework Core ile çalışırken öğrenilen kavramlar ve pratik bilgiler.

---

## DbContext Nedir?

`DbContext` = Veritabanı bağlantısı + Unit of Work + Change Tracking

```csharp
public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();       // Her DbSet = bir tablo
    public DbSet<TaskItem> TaskItems => Set<TaskItem>();
}
```

- `DbContext` bir **Scoped** servis olarak kayıt edilir (her request = bir instance)
- `SaveChangesAsync()` çağrılana kadar hiçbir değişiklik veritabanına gitmez
- Change Tracker hangi entity'nin Added/Modified/Deleted olduğunu bilir

---

## Fluent API vs Data Annotations

| Özellik | Data Annotations | Fluent API |
|---------|-----------------|------------|
| Konum | Entity class üzerinde | Ayrı Configuration class |
| Domain bağımlılığı | EF Core'a bağımlı | Domain saf kalır |
| Güç | Basit kurallar | Her şeyi yapabilir |
| Clean Architecture | Uygun değil | Uygun |

**TaskFlow kararı:** Fluent API. Çünkü Domain katmanı hiçbir dış kütüphaneyi bilmemeli.

```csharp
// YANLIŞ (Data Annotations - Domain'e EF Core bağımlılığı ekler)
public class User : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; }
}

// DOĞRU (Fluent API - Domain saf kalır)
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.FullName).IsRequired().HasMaxLength(100);
    }
}
```

---

## Global Query Filter (Soft Delete)

Her sorguda `WHERE IsDeleted = false` yazmak yerine, bunu otomatik yapabiliriz:

```csharp
// OnModelCreating'de:
modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
```

Artık `_context.Users.ToListAsync()` otomatik olarak silinmemiş kayıtları döndürür.

**Silinen kayıtları görmek gerekirse:**
```csharp
_context.Users.IgnoreQueryFilters().ToListAsync();
```

---

## SaveChangesAsync Override

Timestamp'leri otomatik yönetmek için `SaveChangesAsync`'i override ettik:

```csharp
public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
{
    foreach (var entry in ChangeTracker.Entries<BaseEntity>())
    {
        switch (entry.State)
        {
            case EntityState.Added:
                entry.Entity.CreatedAt = DateTime.UtcNow;
                break;
            case EntityState.Modified:
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                break;
        }
    }
    return base.SaveChangesAsync(cancellationToken);
}
```

Bu sayede hiçbir yerde manuel tarih set etmeye gerek yok.

---

## İlişki Tanımlama

### One-to-Many
```csharp
// Bir User'ın birçok Project'i olabilir
builder.HasOne(p => p.Owner)           // Project → User
    .WithMany(u => u.OwnedProjects)    // User → Projects
    .HasForeignKey(p => p.OwnerId)     // FK: OwnerId
    .OnDelete(DeleteBehavior.Restrict); // Cascade davranışı
```

### OnDelete Davranışları

| Davranış | Ne Yapar | Ne Zaman Kullan |
|----------|----------|-----------------|
| **Cascade** | Parent silinince child'lar da silinir | Project → TaskItems |
| **Restrict** | Parent silinemez (child varsa hata) | User → Projects |
| **SetNull** | FK null olur | User → TaskItems (assignee) |

**Kural:** Kullanıcı verisi Restrict ile korunur. İçerik verisi Cascade ile temizlenir.

---

## Migration Workflow

```bash
# 1. Entity veya Configuration değiştir
# 2. Migration oluştur
dotnet ef migrations add <DescriptiveName> \
  --project src/TaskFlow.Infrastructure \
  --startup-project src/TaskFlow.API \
  --output-dir Data/Migrations

# 3. Oluşan dosyayı kontrol et (Up/Down metodları)
# 4. Veritabanına uygula
dotnet ef database update --startup-project src/TaskFlow.API

# Geri almak gerekirse:
dotnet ef database update <PreviousMigrationName> --startup-project src/TaskFlow.API

# Son migration'ı kaldırmak (henüz uygulanmadıysa):
dotnet ef migrations remove --project src/TaskFlow.Infrastructure --startup-project src/TaskFlow.API
```

---

## Bugün Öğrenilen Hatalar

### HasDefaultValue ve Enum
```csharp
// YANLIŞ: int literal ile enum property'ye default set etme
.HasDefaultValue(0)  // → "Cannot set default value '0' of type 'int'"

// DOĞRU: Enum sabitini kullan
.HasDefaultValue(TaskItemStatus.Todo)
```

### NuGet Versiyon Uyumluluğu
- .NET 9 projelerinde EF Core / Npgsql 9.x kullan
- `--version 9.0.*` ile major version'ı sabitle
- Npgsql 10.x sadece .NET 10 ile çalışır

---

> Bu notlar EF Core ile çalıştıkça genişletilecek.
