# TaskFlow - Başlangıç Rehberi

> Projeyi sıfırdan çalıştırmak için gereken adımlar.

---

## Gereksinimler

| Araç | Versiyon | Kontrol |
|------|----------|---------|
| .NET SDK | 9.0+ | `dotnet --version` |
| Docker Desktop | Son versiyon | `docker --version` |
| Git | Son versiyon | `git --version` |
| dotnet-ef tool | 9.0+ | `dotnet tool list -g` |
| Bir IDE | VS Code veya Rider | — |

### dotnet-ef kurulumu (yoksa)
```bash
dotnet tool install --global dotnet-ef
```

---

## 1. Projeyi Klonla

```bash
git clone https://github.com/yavuzcgg/task-flow.git
cd task-flow
```

## 2. Docker'ı Başlat (PostgreSQL + pgAdmin)

```bash
docker compose up -d
```

Kontrol:
- PostgreSQL: `localhost:5432` (taskflow_user / taskflow_dev_123)
- pgAdmin: `http://localhost:5050` (admin@taskflow.dev / admin123)

```bash
# Sağlık kontrolü
docker compose ps
# taskflow-db statusu "healthy" olmalı
```

## 3. Veritabanını Oluştur (Migration)

```bash
cd backend
dotnet ef database update --startup-project src/TaskFlow.API
```

Bu komut:
- PostgreSQL'e bağlanır
- `taskflow` veritabanında tüm tabloları oluşturur
- Migration history tablosunu oluşturur

## 4. Projeyi Derle

```bash
dotnet build TaskFlow.sln
```

Beklenen çıktı: `0 Uyarı, 0 Hata`

## 5. API'yi Çalıştır

```bash
dotnet run --project src/TaskFlow.API
```

API adresleri:
- HTTP: `http://localhost:5185`
- HTTPS: `https://localhost:7217`
- Swagger: `http://localhost:5185/openapi/v1.json`

## 6. Testleri Çalıştır

```bash
dotnet test
```

---

## Proje Yapısını Anla

```
backend/src/
├── TaskFlow.Domain/           ← Saf iş mantığı, hiçbir bağımlılık yok
│   ├── Entities/              ← BaseEntity, User, Project, TaskItem, Comment
│   └── Enums/                 ← TaskItemStatus, TaskPriority, UserRole
│
├── TaskFlow.Application/      ← Interface'ler ve iş kuralları
│   ├── Interfaces/            ← IGenericRepository, IUnitOfWork
│   ├── DTOs/                  ← Request/Response modelleri (ileride)
│   ├── Services/              ← Service implementasyonları (ileride)
│   └── Validators/            ← FluentValidation kuralları (ileride)
│
├── TaskFlow.Infrastructure/   ← Dış dünya ile iletişim
│   ├── Data/
│   │   ├── AppDbContext.cs    ← EF Core DbContext
│   │   ├── Configurations/   ← Fluent API entity konfigürasyonları
│   │   └── Migrations/       ← EF Core migration dosyaları
│   ├── Repositories/          ← Repository implementasyonları (ileride)
│   └── Extensions/            ← DI extension methods
│
└── TaskFlow.API/              ← HTTP giriş noktası
    ├── Program.cs             ← Uygulama başlangıç noktası + DI
    ├── Controllers/           ← API endpoint'leri (ileride)
    ├── Middleware/             ← Exception handling vb. (ileride)
    └── Hubs/                  ← SignalR hub'ları (ileride)
```

### Veri akışı
```
HTTP Request → Controller → Service → Repository → Database
HTTP Response ← Controller ← Service ← Repository ← Database
```

### Dependency akışı
```
API → Infrastructure → Application → Domain
(dış)                                 (iç)
```

---

## Sık Karşılaşılan Sorunlar

### Docker bağlantı hatası
```
Unable to connect to PostgreSQL
```
**Çözüm:** `docker compose ps` ile container'ın çalıştığından emin ol. "healthy" durumda değilse `docker compose restart taskflow-db`.

### Migration hatası
```
relation "..." already exists
```
**Çözüm:** Veritabanını sıfırla: `docker compose down -v && docker compose up -d`, sonra tekrar `dotnet ef database update`.

### Port çakışması
```
Address already in use :5432
```
**Çözüm:** Başka bir PostgreSQL instance çalışıyor. `docker compose down` yapıp, local PostgreSQL'i durdur.
