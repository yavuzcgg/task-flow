# TaskFlow - Terimler Sözlüğü

> Clean Architecture ve .NET terimlerinin TaskFlow projesindeki karşılıkları.

---

## Clean Architecture Terimleri

### Entity
İş kurallarını ve verileri taşıyan temel nesne. Veritabanı tablosu DEĞİL, iş alanının (domain) bir kavramı.
- **TaskFlow'da:** `User`, `Project`, `TaskItem`, `Comment`
- **Dosya:** `backend/src/TaskFlow.Domain/Entities/`

### Value Object
Kimliği olmayan (Id yok), sadece değerleriyle tanımlanan nesne. İki value object aynı değerlere sahipse eşittir.
- **Örnek:** Email, Money, Address
- **TaskFlow'da:** Henüz yok, ileride `Email` value object'i eklenebilir

### DTO (Data Transfer Object)
Katmanlar arası veri taşıma nesnesi. İş mantığı içermez, sadece veri taşır.
- **Request DTO:** API'ye gelen veri → `CreateTaskRequest`
- **Response DTO:** API'den dönen veri → `TaskResponse`
- **Dosya:** `backend/src/TaskFlow.Application/DTOs/`

### Repository
Veritabanı erişimini soyutlayan arayüz. Application katmanı "veriyi nasıl alacağını" bilmez, sadece "ne istediğini" söyler.
- **Interface:** `IGenericRepository<T>` (Application'da)
- **Implementation:** `GenericRepository<T>` (Infrastructure'da)
- **Dosya:** `backend/src/TaskFlow.Application/Interfaces/`

### Unit of Work
Birden fazla repository işlemini tek bir transaction'da toplayan pattern. Ya hepsi başarılı olur ya hiçbiri.
- **Interface:** `IUnitOfWork` (Application'da)
- **Implementation:** DbContext'in `SaveChangesAsync()` metodu ile sağlanır
- **Dosya:** `backend/src/TaskFlow.Application/Interfaces/IUnitOfWork.cs`

### Use Case / Service
Bir iş senaryosunu baştan sona yürüten sınıf. Controller'dan çağrılır, Repository'leri kullanır.
- **Interface:** `ITaskService` (Application'da)
- **Implementation:** `TaskService` (Application'da)

---

## .NET / ASP.NET Terimleri

### Dependency Injection (DI)
Bir sınıfın bağımlılıklarını dışarıdan alması. `new` ile oluşturmak yerine constructor'dan inject edilir.
```csharp
// YANLIŞ: Tight coupling
public class TaskService { private repo = new TaskRepository(); }

// DOĞRU: Loose coupling via DI
public class TaskService {
    public TaskService(ITaskRepository repo) { ... }
}
```

### DI Lifetime'lar
| Lifetime | Ne Zaman Yeni Instance | Kullanım |
|----------|----------------------|----------|
| **Scoped** | Her HTTP request'te | Repository, DbContext, Service |
| **Transient** | Her inject edildiğinde | Hafif, stateless nesneler |
| **Singleton** | Uygulama başladığında bir kez | Konfigürasyon, cache |

### Middleware
HTTP request pipeline'ında sırayla çalışan katmanlar. Her request middleware zincirinden geçer.
- **Sıra önemli:** Authentication → Authorization → Controller
- **Örnek:** Exception handling middleware, logging middleware

### DbContext
EF Core'un veritabanı bağlantısını yöneten sınıf. Unit of Work pattern'ini built-in sağlar.
- **TaskFlow'da:** `AppDbContext`
- **Dosya:** `backend/src/TaskFlow.Infrastructure/Data/AppDbContext.cs`

### Migration
Veritabanı şemasını kod üzerinden yönetme. Entity değiştiğinde migration oluşturulur, database update ile uygulanır.
```bash
dotnet ef migrations add <İsim>    # Migration oluştur
dotnet ef database update           # Veritabanına uygula
```

### Fluent API
EF Core'da entity konfigürasyonunu method chain ile yapma yöntemi. Data Annotation'lara göre daha güçlü.
- **Dosya:** `backend/src/TaskFlow.Infrastructure/Data/Configurations/`
- **Neden tercih?** Domain entity'leri EF Core'dan bağımsız kalır

---

## Pattern Terimleri (İlerisi İçin)

### CQRS (Command Query Responsibility Segregation)
Okuma (Query) ve yazma (Command) işlemlerini ayırma. TaskFlow bunu kullanmıyor ama sonraki proje kullanacak.

### MediatR
In-process mesajlaşma kütüphanesi. CQRS pattern'ini kolaylaştırır. Controller → MediatR → Handler akışı sağlar.

### Specification Pattern
Sorgu koşullarını nesne olarak tanımlama. `GetActiveTasksByProject(projectId)` gibi sorguları reusable hale getirir.

---

> Bu sözlük proje ilerledikçe genişletilecektir.
