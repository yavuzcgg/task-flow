# CLAUDE.md - TaskFlow Project Instructions

## Proje Özeti
TaskFlow, Clean Architecture ile yazılmış bir Task Management API'dir.
- **Backend:** .NET 9, PostgreSQL 16, EF Core, JWT Auth, SignalR
- **Frontend:** Next.js 14 (henüz başlanmadı)
- **Altyapı:** Docker Compose (PostgreSQL + pgAdmin)

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
- Tüm Entity'ler BaseEntity'den türer (Id, CreatedAt, UpdatedAt)
- Async/await pattern her yerde kullanılır
- Nullable reference types aktif (`<Nullable>enable</Nullable>`)
- Her endpoint'te uygun HTTP status code döndürülür
- Connection string'ler appsettings'te, secret'lar environment variable'da

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
cd backend && dotnet build          # Derleme
cd backend && dotnet run --project src/TaskFlow.API  # API çalıştır
cd backend && dotnet test           # Tüm testleri çalıştır

# Docker
docker-compose up -d                # Servisleri başlat
docker-compose down                 # Servisleri durdur
```

## Hata Takibi ve Sürekli Gelişim

> **Bu bölüm kritik:** Her yapılan hatadan ders çıkarılmalı ve not edilmelidir.

### Kurallar
1. Bir hata yapıldığında veya kullanıcı düzeltme yaptığında, hata ve çözümü bu bölüme eklenir
2. Aynı hata ikinci kez yapılmaz - önce bu listeye bakılır
3. Her hata kaydı şu formatta tutulur:
   - **Hata:** Ne yapıldı yanlış
   - **Neden:** Neden yanlıştı
   - **Çözüm:** Doğru yaklaşım ne olmalı
   - **Tarih:** Ne zaman oldu

### Hata Günlüğü
_(Henüz hata kaydı yok - projede ilerledikçe buraya eklenecek)_

<!--
Örnek format:
#### [2026-03-24] Git commit'te co-author eklenmemeli
- **Hata:** Commit mesajına otomatik co-author satırı eklendi
- **Neden:** Kullanıcı co-author istemediğini belirtti
- **Çözüm:** Kullanıcı açıkça istemedikçe co-author ekleme
-->
