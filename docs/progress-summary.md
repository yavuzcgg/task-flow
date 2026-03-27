# TaskFlow - İlerleme Özeti

> En baştan bugüne kadar ne yaptık, adım adım.

---

## Proje Ne?

TaskFlow, **Trello + Jira'dan ilham alan** bir Task Management API.
Clean Architecture öğrenmek için sıfırdan yazılıyor.
Tech stack: .NET 9, PostgreSQL 16, EF Core, JWT Auth, Docker.

---

## Adım Adım Ne Yaptık

### 1. Proje İskeleti
- Clean Architecture 4 katman oluşturuldu:
  - **Domain** → Entity, Enum (saf C#, bağımlılık yok)
  - **Application** → Interface, DTO (sadece Domain'i bilir)
  - **Infrastructure** → EF Core, Repository, Service (Application'ı implement eder)
  - **API** → Controller, Middleware (her şeyi bağlar)
- Test projeleri: UnitTests + IntegrationTests (xUnit)
- Docker Compose: PostgreSQL 16 + pgAdmin
- GitHub repo: `yavuzcgg/task-flow`

### 2. Domain Katmanı — Entity'ler
- **BaseEntity** → Id (Guid), CreatedAt, UpdatedAt, CreatedBy, UpdatedBy, IsDeleted, DeletedAt, IsActive, DeactivatedAt
- **User** → FullName, Email, Role, ProfileImageUrl + audit/soft delete alanları
- **Project** → Name, Description, IsPublic, OwnerId
- **TaskItem** → Title, Description, Status, Priority, DueDate, ProjectId, AssigneeId, CreatedById
- **Comment** → Content, TaskItemId, AuthorId
- **Enum'lar:** TaskItemStatus (Todo/InProgress/InReview/Done), TaskPriority (Low/Medium/High/Critical), UserRole (Developer/PM/Admin)

### 3. Infrastructure — Veritabanı
- EF Core 9.0.x + Npgsql (PostgreSQL provider)
- **AppDbContext** → IdentityDbContext'ten türer, global soft delete query filter, otomatik timestamp yönetimi
- **Fluent API Configurations** → User, Project, TaskItem, Comment (ilişkiler, index'ler, cascade kuralları)
- **İlişki kuralları:**
  - Project silinirse → TaskItem'lar da silinir (Cascade)
  - TaskItem silinirse → Comment'ler da silinir (Cascade)
  - User silinirse → Project/TaskItem silinmez (Restrict)
  - User silinirse → Atanan görevlerin AssigneeId'si null olur (SetNull)
- **Migration'lar:** InitialCreate + AddIdentity → PostgreSQL'e uygulandı

### 4. ASP.NET Identity Entegrasyonu
- User entity: `BaseEntity` → `IdentityUser<Guid>` olarak değiştirildi
- Identity tabloları oluşturuldu: AspNetUsers, AspNetRoles, AspNetUserRoles, AspNetUserClaims, vb.
- Password kuralları: min 6 karakter, büyük/küçük harf, rakam
- Unique email zorunluluğu

### 5. JWT Authentication
- **TokenService** → JWT access token üretimi (claims: sub, email, fullName, role) + refresh token
- **AuthService** → Register (UserManager.CreateAsync) + Login (CheckPasswordAsync)
- **AuthController:**
  - `POST /api/v1/auth/register` → 201 + JWT token
  - `POST /api/v1/auth/login` → 200 + JWT token
- JWT Bearer middleware: token validation (issuer, audience, signing key, lifetime)
- appsettings: SecretKey, Issuer, Audience, 30 dk access token, 7 gün refresh token

### 6. Repository + Unit of Work Pattern
- **GenericRepository<T>** → CRUD operasyonları (soft delete ile)
- **UnitOfWork** → SaveChangesAsync wrapper
- DI: open generic registration (`typeof(IGenericRepository<>)`)
- Constraint: `where T : BaseEntity` — User hariç tüm entity'ler için çalışır

### 7. CRUD Controller'lar (Şu An)
- **ProjectsController** → GET (list), GET (by id), POST, PUT, DELETE
- **TasksController** → GET (by project), GET (by id), POST, PUT, PATCH (status), DELETE
- **CommentsController** → GET (by task), POST, DELETE
- Tüm endpoint'ler `[Authorize]` ile korunuyor
- Her controller kendi Service'ini kullanıyor (Clean Architecture: Controller → Service → DbContext)
- Service'ler: ProjectService, TaskService, CommentService
- DTO'lar: CreateProjectRequest, UpdateProjectRequest, ProjectResponse, CreateTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest, TaskResponse, CreateCommentRequest, CommentResponse

---

## Şu Anki API Endpoint'leri

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/v1/auth/register` | Kayıt ol | - |
| POST | `/api/v1/auth/login` | Giriş yap | - |
| GET | `/api/v1/projects` | Projelerimi listele | JWT |
| GET | `/api/v1/projects/{id}` | Proje detayı | JWT |
| POST | `/api/v1/projects` | Yeni proje | JWT |
| PUT | `/api/v1/projects/{id}` | Proje güncelle | JWT |
| DELETE | `/api/v1/projects/{id}` | Proje sil | JWT |
| GET | `/api/v1/projects/{id}/tasks` | Projedeki görevler | JWT |
| GET | `/api/v1/tasks/{id}` | Görev detayı | JWT |
| POST | `/api/v1/projects/{id}/tasks` | Yeni görev | JWT |
| PUT | `/api/v1/tasks/{id}` | Görev güncelle | JWT |
| PATCH | `/api/v1/tasks/{id}/status` | Durum değiştir | JWT |
| DELETE | `/api/v1/tasks/{id}` | Görev sil | JWT |
| GET | `/api/v1/tasks/{id}/comments` | Yorumlar | JWT |
| POST | `/api/v1/tasks/{id}/comments` | Yorum ekle | JWT |
| DELETE | `/api/v1/comments/{id}` | Yorum sil | JWT |

---

## Clean Architecture Akışı (Her Request'te)

```
HTTP Request
    ↓
[API] Controller (AuthController, ProjectsController, ...)
    ↓ DTO alır, Service çağırır
[Application] Interface (IProjectService, ITaskService, ...)
    ↓ İş mantığı sözleşmesi
[Infrastructure] Service (ProjectService, TaskService, ...)
    ↓ EF Core ile veritabanı işlemi
[Infrastructure] AppDbContext → PostgreSQL
    ↓
HTTP Response (DTO olarak döner)
```

---

## Öğrenilen Dersler (CLAUDE.md'den)

1. **Navigation property isim çakışması** → BaseEntity.CreatedBy (Guid) ile TaskItem.CreatedBy (User) çakıştı → `Creator` olarak yeniden adlandırıldı
2. **EF Core HasDefaultValue + enum** → `HasDefaultValue(0)` yerine `HasDefaultValue(TaskItemStatus.Todo)` kullan
3. **NuGet versiyon uyumu** → .NET 9 = paket 9.x, `--version 9.0.*` ile sabitle
4. **pgAdmin bağlantı** → Docker'da bile `localhost` kullan (port mapping varsa)

---

## Sırada Ne Var?

| Görev | Öncelik |
|-------|---------|
| Global Exception Middleware | Yüksek — try-catch'ler yerine merkezi hata yönetimi |
| FluentValidation | Yüksek — DTO validasyonu |
| AutoMapper | Orta — Entity ↔ DTO dönüşümünü otomatikleştir |
| Role-Based Authorization | Orta — Owner/Admin kontrolü |
| Refresh Token mekanizması | Orta — Token yenileme |
| Pagination + Filtering | Orta — Liste endpoint'lerinde |
| SignalR (Real-time) | Düşük — Task durumu değişince bildirim |
| Unit Tests | Düşük — Service + Domain testleri |
| Frontend (Next.js) | İleride |

---

## Hızlı Başlangıç

```bash
# 1. Docker'ı başlat
docker compose up -d

# 2. Migration uygula
cd backend && dotnet ef database update --startup-project src/TaskFlow.API

# 3. API'yi çalıştır
dotnet run --project src/TaskFlow.API

# 4. Test et
# Register
curl -X POST http://localhost:5185/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"Test1234"}'

# Login → token al
curl -X POST http://localhost:5185/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}'

# Proje oluştur (token ile)
curl -X POST http://localhost:5185/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"My Project"}'
```
