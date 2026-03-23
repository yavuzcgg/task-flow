# TaskFlow API

Modern bir Task / Project Management uygulaması. Clean Architecture ile .NET 9 Web API + Next.js frontend.

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Backend | .NET 9 Web API |
| Frontend | Next.js 14 (TypeScript) |
| Database | PostgreSQL 16 |
| Auth | JWT + ASP.NET Identity |
| Real-time | SignalR |
| Container | Docker + Docker Compose |

## Proje Yapısı

```
TaskFlow/
├── backend/          # .NET Clean Architecture API
│   ├── src/
│   │   ├── TaskFlow.Domain/          # Entities, Enums
│   │   ├── TaskFlow.Application/     # Use Cases, DTOs, Validators
│   │   ├── TaskFlow.Infrastructure/  # EF Core, Repositories
│   │   └── TaskFlow.API/            # Controllers, Middleware
│   └── tests/
├── frontend/         # Next.js App
└── docs/             # Mimari kararlar ve notlar
```

## Hızlı Başlangıç

### Gereksinimler
- .NET 9 SDK
- Node.js 18+
- Docker & Docker Compose

### Kurulum

```bash
# 1. PostgreSQL'i ayağa kaldır
docker compose up -d

# 2. Backend'i çalıştır
cd backend
dotnet run --project src/TaskFlow.API

# 3. Frontend'i çalıştır (ayrı terminal)
cd frontend/taskflow-web
npm install
npm run dev
```

### Erişim
- **API:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger
- **Frontend:** http://localhost:3000
- **pgAdmin:** http://localhost:5050 (admin@taskflow.dev / admin123)

## Mimari

Bu proje **Clean Architecture** prensiplerini takip eder:
- **Domain** → İş kuralları, entity'ler (bağımsız katman)
- **Application** → Use case'ler, DTO'lar, validasyon
- **Infrastructure** → Veritabanı, dış servisler
- **API** → HTTP katmanı, controller'lar

Detaylar: [docs/architecture-decisions/](docs/architecture-decisions/)
