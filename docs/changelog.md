# TaskFlow - Changelog

> Projedeki tüm önemli değişikliklerin kaydı. [Keep a Changelog](https://keepachangelog.com/) formatı.

---

## [Unreleased]

### Added
- BaseEntity'ye audit trail (CreatedBy, UpdatedBy) ve soft delete/disable (IsDeleted, IsActive) alanları
- Project entity'ye `IsPublic` alanı
- EF Core + Npgsql NuGet paketleri (9.0.x)
- AppDbContext: global soft delete query filter, otomatik timestamp yönetimi
- Entity Configuration'lar (Fluent API): User, Project, TaskItem, Comment
- Infrastructure DI extension method (`AddInfrastructure`)
- InitialCreate migration
- Connection string: PostgreSQL (Docker)
- CLAUDE.md: çalışma kuralları, projenin amacı, sürekli gelişim bölümleri
- Docs: project-vision, glossary, changelog, getting-started guide, entity ekleme rehberi, EF Core notları

### Changed
- TaskItem: `CreatedBy` navigation property → `Creator` (BaseEntity.CreatedBy ile çakışma)
- TaskItemConfiguration: `HasDefaultValue(0)` → `HasDefaultValue(TaskItemStatus.Todo)` (enum uyumu)

---

## [0.2.0] - 2026-03-26

### Added
- User entity (FullName, Email, PasswordHash, Role, ProfileImageUrl)
- Project entity (Name, Description, OwnerId)
- TaskItem entity (Title, Description, Status, Priority, DueDate, ProjectId, AssigneeId, CreatedById)
- Comment entity (Content, TaskItemId, AuthorId)
- Tüm navigation property'ler ve ilişkiler tanımlandı

---

## [0.1.0] - 2026-03-26

### Added
- Clean Architecture proje yapısı (Domain, Application, Infrastructure, API)
- BaseEntity (Id, CreatedAt, UpdatedAt)
- Enum'lar: TaskItemStatus, TaskPriority, UserRole
- IGenericRepository ve IUnitOfWork interface'leri
- Docker Compose: PostgreSQL 16 + pgAdmin
- ADR-001: Clean Architecture kararı
- ADR-002: PostgreSQL kararı
- ADR-003: Repository + UoW pattern kararı
- ADR-004: JWT Auth kararı
- Docs: project-roadmap, api-design, coding-conventions, database-schema

---

## [0.0.1] - 2026-03-26

### Added
- Initial commit: proje iskeleti, README, .gitignore
