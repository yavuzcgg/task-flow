# TaskFlow - Veritabanı Şeması

> PostgreSQL 16 ile kullanılacak tablo yapıları.

---

## ER Diyagramı (Metin)

```
Users (1) ──── (N) Projects        (Proje sahibi)
Users (1) ──── (N) TaskItems       (Atanan kişi / Oluşturan)
Users (1) ──── (N) Comments        (Yorum yazan)
Projects (1) ── (N) TaskItems      (Projedeki görevler)
TaskItems (1) ─ (N) Comments       (Göreve yapılan yorumlar)
```

---

## Tablolar

### Users (ASP.NET Identity)
ASP.NET Identity tarafından yönetilir. Ek alanlar:

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | uniqueidentifier (PK) | ASP.NET Identity default |
| FullName | nvarchar(100) | Kullanıcı adı soyadı |
| Role | int | UserRole enum (Developer, PM, Admin) |
| ProfileImageUrl | nvarchar(500) | Profil fotoğrafı (nullable) |
| CreatedAt | timestamp with tz | Kayıt tarihi |
| UpdatedAt | timestamp with tz | Güncelleme tarihi (nullable) |

> Identity tabloları: AspNetUsers, AspNetRoles, AspNetUserRoles, vb. otomatik oluşturulur.

### Projects

| Kolon | Tip | Constraint | Açıklama |
|-------|-----|------------|----------|
| Id | uuid | PK | |
| Name | varchar(200) | NOT NULL | Proje adı |
| Description | text | NULL | Proje açıklaması |
| OwnerId | uuid | FK → Users | Proje sahibi |
| CreatedAt | timestamptz | NOT NULL | |
| UpdatedAt | timestamptz | NULL | |

### TaskItems

| Kolon | Tip | Constraint | Açıklama |
|-------|-----|------------|----------|
| Id | uuid | PK | |
| Title | varchar(300) | NOT NULL | Görev başlığı |
| Description | text | NULL | Görev detayı |
| Status | int | NOT NULL, DEFAULT 0 | TaskItemStatus enum |
| Priority | int | NOT NULL, DEFAULT 1 | TaskPriority enum |
| ProjectId | uuid | FK → Projects | Ait olduğu proje |
| AssigneeId | uuid | FK → Users, NULL | Atanan kişi |
| CreatedById | uuid | FK → Users | Oluşturan kişi |
| DueDate | timestamptz | NULL | Son tarih |
| CreatedAt | timestamptz | NOT NULL | |
| UpdatedAt | timestamptz | NULL | |

**Index'ler:**
- `IX_TaskItems_ProjectId` → Projeye göre filtreleme
- `IX_TaskItems_AssigneeId` → Kullanıcıya atanan görevler
- `IX_TaskItems_Status` → Duruma göre filtreleme

### Comments

| Kolon | Tip | Constraint | Açıklama |
|-------|-----|------------|----------|
| Id | uuid | PK | |
| Content | text | NOT NULL | Yorum içeriği |
| TaskItemId | uuid | FK → TaskItems | Ait olduğu görev |
| AuthorId | uuid | FK → Users | Yazan kişi |
| CreatedAt | timestamptz | NOT NULL | |
| UpdatedAt | timestamptz | NULL | |

---

## İlişkiler ve Cascade Kuralları

| İlişki | Cascade |
|--------|---------|
| User → Projects | Restrict (kullanıcı silinirse proje silinmez) |
| User → TaskItems | SetNull (kullanıcı silinirse assignee null olur) |
| Project → TaskItems | Cascade (proje silinirse görevler de silinir) |
| TaskItem → Comments | Cascade (görev silinirse yorumlar da silinir) |
| User → Comments | Restrict (kullanıcı silinirse yorum silinmez) |

---

## Connection String

```
Host=localhost;Port=5432;Database=taskflow;Username=taskflow_user;Password=taskflow_dev_123
```
