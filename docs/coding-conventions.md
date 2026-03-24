# TaskFlow - Kodlama Standartları

> Projede tutarlılık sağlamak için uyulması gereken kurallar.

---

## C# / .NET Kuralları

### Naming

| Tür | Kural | Örnek |
|-----|-------|-------|
| Class / Record | PascalCase | `TaskItem`, `CreateTaskRequest` |
| Interface | I + PascalCase | `ITaskRepository`, `IUnitOfWork` |
| Method | PascalCase | `GetByIdAsync`, `CreateTask` |
| Property | PascalCase | `CreatedAt`, `FullName` |
| Private field | _camelCase | `_repository`, `_logger` |
| Parameter | camelCase | `cancellationToken`, `taskId` |
| Constant | PascalCase | `MaxRetryCount`, `DefaultPageSize` |
| Enum value | PascalCase | `InProgress`, `Critical` |

### Async Convention
- Async method'lar `Async` suffix'i alır: `GetAllAsync()`, `SaveChangesAsync()`
- `CancellationToken` son parametre olarak eklenir
- Fire-and-forget kullanılmaz, her async çağrı await edilir

### Dosya Yapısı
- Bir dosyada bir class/interface/record
- Dosya adı = class adı (`TaskItem.cs` → `class TaskItem`)
- Namespace = folder yapısı (`TaskFlow.Domain.Entities`)

### Entity Kuralları
- Tüm entity'ler `BaseEntity`'den türer
- Primary key: `Guid` (otomatik oluşturulur)
- Navigation property'ler virtual olmaz (lazy loading kapalı)
- Required field'lar constructor'da set edilir veya `required` keyword kullanılır

### DTO Kuralları
- Request DTO: `{Action}{Entity}Request` → `CreateTaskRequest`, `UpdateProjectRequest`
- Response DTO: `{Entity}Response` → `TaskResponse`, `ProjectResponse`
- DTO'larda validation attribute'ları kullanılmaz (FluentValidation tercih edilir)

---

## API Kuralları

### Controller
- Route: `api/v1/[controller]` (çoğul isim)
- Her action method `[ProducesResponseType]` attribute'ı alır
- Business logic controller'da olmaz, service'e delege edilir
- `ActionResult<T>` return type kullanılır

### HTTP Method Kullanımı
```
GET    → Veri oku (idempotent)
POST   → Yeni kayıt oluştur
PUT    → Kaydın tamamını güncelle
PATCH  → Kaydın bir kısmını güncelle
DELETE → Kayıt sil
```

---

## Git Kuralları

### Commit Mesajı Formatı
```
<type>: <kısa açıklama>

Opsiyonel detaylı açıklama.
```

### Commit Tipleri
| Tip | Kullanım |
|-----|----------|
| `feat` | Yeni özellik |
| `fix` | Bug düzeltme |
| `refactor` | Kod iyileştirme (davranış değişmez) |
| `docs` | Sadece döküman değişikliği |
| `test` | Test ekleme/düzeltme |
| `chore` | Build, config, tooling değişikliği |

### Örnek
```
feat: add User entity with Identity integration
fix: resolve null reference in TaskService.GetByIdAsync
docs: update API design with comment endpoints
```

---

## Proje Organizasyonu

### Backend Klasör Yapısı
```
src/TaskFlow.Domain/
├── Entities/          # BaseEntity, User, TaskItem, Project, Comment
├── Enums/             # TaskItemStatus, TaskPriority, UserRole
└── ValueObjects/      # Email, Password (opsiyonel)

src/TaskFlow.Application/
├── DTOs/              # Request ve Response modelleri
├── Interfaces/        # Repository ve Service interface'leri
├── Services/          # İş mantığı implementasyonları
├── Validators/        # FluentValidation kuralları
└── Mappings/          # AutoMapper profilleri

src/TaskFlow.Infrastructure/
├── Data/              # AppDbContext, Entity Configurations
├── Repositories/      # Repository implementasyonları
└── Services/          # JWT, Email vb. dış servisler

src/TaskFlow.API/
├── Controllers/       # API endpoint'leri
├── Extensions/        # DI, Swagger, Auth konfigürasyonları
├── Middleware/         # Exception handling, logging
└── Hubs/              # SignalR hub'ları
```
