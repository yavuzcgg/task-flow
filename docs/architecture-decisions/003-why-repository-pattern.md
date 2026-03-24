# ADR-003: Repository + Unit of Work Pattern

**Tarih:** 2026-03-24
**Durum:** Accepted

---

## Bağlam

Veritabanı erişimini nasıl soyutlayacağımıza karar vermemiz gerekiyor. EF Core zaten bir Unit of Work (DbContext) ve Repository (DbSet) sağlıyor. Üzerine bir katman daha eklemeli miyiz?

## Karar

**Generic Repository + Unit of Work pattern kullanılacak.**

## Nedenler

### 1. Dependency Inversion
- Application katmanı veritabanı teknolojisini bilmemeli
- `IGenericRepository<T>` Application'da, `GenericRepository<T>` Infrastructure'da
- Yarın EF Core yerine Dapper kullanmak istersek sadece Infrastructure değişir

### 2. Testability
- Service katmanı mock repository ile test edilebilir
- Veritabanı olmadan birim test yazılabilir
- `IUnitOfWork` ile transaction davranışı kontrol edilebilir

### 3. DRY (Don't Repeat Yourself)
- CRUD operasyonları her entity için aynı
- `GenericRepository<T>` ile tekrar eden kod önlenir
- Entity-specific repository'ler sadece özel sorgular için oluşturulur

## Yapı

```
Application/Interfaces/
├── IGenericRepository<T>    # Genel CRUD
├── ITaskRepository          # Task'a özel sorgular (extends IGenericRepository)
├── IUnitOfWork              # SaveChanges transaction yönetimi

Infrastructure/Repositories/
├── GenericRepository<T>     # EF Core implementasyonu
├── TaskRepository           # Task-specific queries
├── UnitOfWork               # DbContext.SaveChangesAsync wrapper
```

## Alternatifler

| Yaklaşım | Avantaj | Dezavantaj |
|-----------|---------|------------|
| Direkt DbContext | Basit, az kod | Tight coupling, test zorluğu |
| Repository Pattern | Soyutlama, test kolaylığı | Ekstra katman |
| CQRS + MediatR | Separation of concerns | Karmaşıklık, overengineering riski |

## Sonuç

Bu proje için Repository + UoW yeterli. İleride ihtiyaç olursa CQRS eklenebilir ama başlangıçta basit tutmak daha doğru.
