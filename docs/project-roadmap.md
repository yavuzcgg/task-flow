# TaskFlow - Proje Yol Haritası

> Bu döküman projenin adım adım gelişim planını içerir.
> Her faz tamamlandığında ilgili checkbox işaretlenir.

---

## Faz 1: Domain Katmanı (Temel Entity'ler)
- [x] BaseEntity oluştur (Id, CreatedAt, UpdatedAt)
- [x] Enum'lar: TaskItemStatus, TaskPriority, UserRole
- [ ] User entity
- [ ] Project entity
- [ ] TaskItem entity
- [ ] Comment entity
- [ ] Domain validation rules

## Faz 2: Infrastructure - Veritabanı Kurulumu
- [x] Docker Compose (PostgreSQL + pgAdmin)
- [ ] EF Core NuGet paketlerini ekle
- [ ] AppDbContext oluştur
- [ ] Entity Configuration'lar (Fluent API)
- [ ] Initial Migration oluştur ve uygula
- [ ] GenericRepository implementasyonu
- [ ] UnitOfWork implementasyonu
- [ ] Seed Data (varsayılan roller, test verisi)

## Faz 3: Application Katmanı - İş Mantığı
- [ ] DTO'lar (Request/Response modelleri)
- [ ] AutoMapper profilleri (Entity ↔ DTO)
- [ ] FluentValidation kuralları
- [ ] Service interface'leri ve implementasyonları
  - [ ] IAuthService / AuthService
  - [ ] ITaskService / TaskService
  - [ ] IProjectService / ProjectService
- [ ] MediatR + CQRS pattern (opsiyonel)

## Faz 4: API Katmanı - Endpoint'ler
- [ ] DI Container konfigürasyonu (ServiceExtensions)
- [ ] Exception handling middleware
- [ ] AuthController (Register, Login, RefreshToken)
- [ ] ProjectsController (CRUD)
- [ ] TasksController (CRUD + status değişikliği)
- [ ] CommentsController
- [ ] Swagger/OpenAPI dokümantasyonu
- [ ] API versiyonlama

## Faz 5: Authentication & Authorization
- [ ] ASP.NET Identity kurulumu
- [ ] JWT token oluşturma ve doğrulama
- [ ] Refresh token mekanizması
- [ ] Role-based authorization ([Authorize(Roles = "Admin")])
- [ ] Policy-based authorization (proje sahipliği vb.)

## Faz 6: Real-Time (SignalR)
- [ ] TaskHub oluştur
- [ ] Task durum değişikliğinde bildirim
- [ ] Proje bazlı grup yönetimi
- [ ] Frontend entegrasyonu

## Faz 7: Testing
- [ ] Unit Test: Domain entity validasyonları
- [ ] Unit Test: Service layer (mock repository)
- [ ] Integration Test: API endpoint'leri
- [ ] Integration Test: Repository + veritabanı
- [ ] Code coverage raporlama

## Faz 8: Frontend (Next.js 14)
- [ ] Next.js projesi oluştur
- [ ] Tailwind CSS + shadcn/ui kurulumu
- [ ] Auth sayfaları (Login, Register)
- [ ] Dashboard sayfası
- [ ] Proje listesi ve detay sayfaları
- [ ] Kanban board (sürükle-bırak)
- [ ] SignalR entegrasyonu (real-time güncellemeler)

## Faz 9: DevOps & Deployment
- [ ] Dockerfile (backend)
- [ ] Dockerfile (frontend)
- [ ] docker-compose.prod.yml
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment-based konfigürasyon
- [ ] Health check endpoint'leri

---

## Öncelik Sırası
1. **Faz 1-2** → Veritabanı ve entity'ler olmadan hiçbir şey çalışmaz
2. **Faz 3-4** → API endpoint'leri iş mantığına bağımlı
3. **Faz 5** → Auth olmadan güvenli API olmaz
4. **Faz 7** → Her fazdan sonra test yazılmalı (ideal)
5. **Faz 6, 8, 9** → Temel API stabil olduktan sonra
