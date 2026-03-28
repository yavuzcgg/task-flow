# CLAUDE.md - TaskFlow Project Instructions

## Proje Özeti
TaskFlow, Clean Architecture ile yazılmış bir Task Management API'dir.
- **Backend:** .NET 9, PostgreSQL 16, EF Core, JWT Auth, SignalR
- **Frontend:** Next.js 14 (henüz başlanmadı)
- **Altyapı:** Docker Compose (PostgreSQL + pgAdmin)
- **İlham:** Trello + Jira (simplified), ileride AI özellikleri (Gemini API) eklenebilir

## Projenin Amacı

> Bu proje **Clean Architecture'ı derinlemesine öğrenmek** için yazılıyor.

- Katman ayrımı, Dependency Inversion, DI pattern'leri tam oturmalı
- Sonraki proje: **Onion Architecture + CQRS + MediatR** olacak — bu temel sağlam olmalı
- Hedef: Junior → Mid-level geçişte referans proje
- Her mimari karar bilinçli yapılır ve `docs/architecture-decisions/` altında belgelenir

## Mimari Kurallar

### Clean Architecture Katmanları
```
Domain → Application → Infrastructure + API
```
- **Domain:** Entity, Enum, Value Object. Hiçbir dış bağımlılık yok.
- **Application:** Interface, DTO, Service, Validator. Sadece Domain'e bağımlı.
- **Infrastructure:** EF Core, Repository implementasyonları, dış servisler. Application'a bağımlı.
- **API:** Controller, Middleware, Extension. Application ve Infrastructure'a bağımlı.

### Dependency Rule
- İç katmanlar dış katmanları bilmez (Domain → hiçbir şeyi bilmez)
- Interface'ler Application'da tanımlanır, Infrastructure'da implement edilir
- API katmanı DI ile her şeyi bağlar

## Kod Standartları

### Naming Conventions
- **Entity:** PascalCase, tekil isim (TaskItem, User, Project)
- **Interface:** "I" prefix (ITaskRepository, IUnitOfWork)
- **DTO:** Suffix olarak Request/Response (CreateTaskRequest, TaskResponse)
- **Controller:** Çoğul isim + Controller (TasksController, ProjectsController)
- **Enum:** PascalCase, tekil (TaskItemStatus, TaskPriority)

### Genel Kurallar
- Tüm Entity'ler BaseEntity'den türer (Id, CreatedAt, UpdatedAt, IsActive, IsDeleted, audit trail)
- Async/await pattern her yerde kullanılır
- Nullable reference types aktif (`<Nullable>enable</Nullable>`)
- Her endpoint'te uygun HTTP status code döndürülür
- Connection string'ler appsettings'te, secret'lar environment variable'da

## Çalışma Kuralları

### 1. Plan-First Yaklaşım
- Trivial olmayan her görev için (3+ adım veya mimari karar) önce plan yap
- Hangi katmanlar etkilenecek? Dependency rule ihlal ediliyor mu?
- Bir şey ters giderse DUR ve yeniden planla — körlemesine devam etme

### Plan Arşivleme
- Onaylanan her plan `docs/plans/` altında arşivlenir
- Format: `docs/plans/NNN-plan-adi.md` (örn: `001-global-exception-middleware.md`)
- Dosyanın üstünde tarih yer alır
- Bu kural her plan için geçerlidir — atlanmaz

### 2. Doğrulama Zorunluluğu
- "Bitti" demeden önce kanıtla:
  - `dotnet build` başarılı mı?
  - `dotnet test` geçti mi?
  - Yeni endpoint varsa Swagger'dan test et
  - Migration varsa `database update` başarılı mı?
- Kendine sor: "Kıdemli bir geliştirici bunu onaylar mıydı?"

### 3. Otonom Bug Fixing
- Build error, typo, missing using gibi açık hataları direkt düzelt
- Mimari karar gerektiren hatalar için sor
- Log'lara bak, hatayı bul, çöz — gereksiz sorularla vakit kaybetme

### 4. Basitlik İlkesi
- Over-engineering yapma. "Buna gerçekten ihtiyacım var mı?" sorusunu sor
- Minimum değişiklik, maksimum etki
- Temiz ve okunabilir kod > zekice kod
- Geçici fix yerine root cause bul — ama basit tut

## Proje Yapısı
```
TaskFlow/
├── backend/
│   ├── src/
│   │   ├── TaskFlow.Domain/          # Entity, Enum, Value Object
│   │   ├── TaskFlow.Application/     # Interface, DTO, Service, Validator
│   │   ├── TaskFlow.Infrastructure/  # EF Core, Repository, External Services
│   │   └── TaskFlow.API/             # Controller, Middleware, Hub, Extension
│   └── tests/
│       ├── TaskFlow.UnitTests/       # Domain + Application testleri
│       └── TaskFlow.IntegrationTests/ # API endpoint testleri
├── frontend/                          # Next.js 14 (henüz başlanmadı)
├── docs/                              # Mimari kararlar, API docs, öğrenme notları
└── docker-compose.yml                 # PostgreSQL + pgAdmin
```

## Docker Ortamı
```bash
docker-compose up -d          # PostgreSQL + pgAdmin başlat
# PostgreSQL: localhost:5432  (taskflow_user / taskflow_dev_123)
# pgAdmin:    localhost:5050  (admin@taskflow.dev / admin123)
```

## Sık Kullanılan Komutlar
```bash
# Backend
cd backend && dotnet build                              # Derleme
cd backend && dotnet run --project src/TaskFlow.API     # API çalıştır
cd backend && dotnet test                               # Tüm testleri çalıştır

# EF Core Migration
cd backend && dotnet ef migrations add <Name> --project src/TaskFlow.Infrastructure --startup-project src/TaskFlow.API --output-dir Data/Migrations
cd backend && dotnet ef database update --startup-project src/TaskFlow.API

# Docker
docker-compose up -d                # Servisleri başlat
docker-compose down                 # Servisleri durdur
```

## Sürekli Gelişim

> **Bu bölüm kritik:** Her hatadan VE her öğrenilen şeyden ders çıkarılmalı.

### Kurallar
1. Bir hata yapıldığında veya kullanıcı düzeltme yaptığında → buraya ekle
2. Yeni bir şey öğrenildiğinde (aha moment) → buraya ekle
3. Aynı hata ikinci kez yapılmaz — önce bu listeye bak
4. Format:
   - **Konu:** Ne hakkında
   - **Ne Oldu:** Ne yapıldı / ne keşfedildi
   - **Ne Öğrendim:** Doğru yaklaşım ne
   - **Tarih:** Ne zaman

### Günlük

#### [2026-03-26] BaseEntity.CreatedBy ile navigation property isim çakışması
- **Konu:** Property naming conflict
- **Ne Oldu:** BaseEntity'ye `CreatedBy` (Guid?) eklenince, TaskItem'daki `CreatedBy` (User) navigation property ile çakıştı → CS0108 uyarısı
- **Ne Öğrendim:** Navigation property ile FK/audit alanlarını isimlendirirken çakışma kontrolü yap. Navigation'ı `Creator` olarak yeniden adlandırdık
- **Tarih:** 2026-03-26

#### [2026-03-26] EF Core HasDefaultValue ile enum çakışması
- **Konu:** Fluent API default value
- **Ne Oldu:** `.HasDefaultValue(0)` yazdık ama property tipi enum. EF Core "Cannot set default value '0' of type 'int' on property of type 'TaskItemStatus'" hatası verdi
- **Ne Öğrendim:** HasDefaultValue'da her zaman enum değerini kullan: `.HasDefaultValue(TaskItemStatus.Todo)`, int literal değil
- **Tarih:** 2026-03-26

#### [2026-03-26] Npgsql 10.x .NET 9 ile uyumsuz
- **Konu:** NuGet paket uyumluluğu
- **Ne Oldu:** `dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL` en son 10.x'i çekti, .NET 9 ile uyumsuz (net10.0 gerektiriyor)
- **Ne Öğrendim:** .NET 9 projelerinde `--version 9.0.*` ile major version'ı sabitle. Her zaman framework version = paket major version
- **Tarih:** 2026-03-26

#### [2026-03-26] pgAdmin'de PostgreSQL host adı: localhost kullan
- **Konu:** Docker pgAdmin bağlantı sorunu
- **Ne Oldu:** pgAdmin Register Server'da host olarak `taskflow-db` (container adı) yazıldı ama bağlanamadı. pgAdmin Docker içinde çalışsa bile, port 5432 host'a map'lendiği için `localhost` kullanmak gerekiyor
- **Ne Öğrendim:** Docker Compose'da port mapping varsa (`5432:5432`), pgAdmin dahil tüm araçlardan `localhost` ile bağlan
- **Tarih:** 2026-03-26
