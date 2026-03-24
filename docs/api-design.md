# TaskFlow API Tasarımı

> Planlanan API endpoint'leri ve yapıları.

---

## Base URL
```
http://localhost:5185/api/v1
```

## Authentication Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/auth/register` | Yeni kullanıcı kaydı |
| POST | `/auth/login` | Giriş yap, JWT token al |
| POST | `/auth/refresh-token` | Token yenile |
| POST | `/auth/logout` | Çıkış yap |

### POST /auth/register
```json
// Request
{
  "fullName": "Yavuz Çağ",
  "email": "yavuz@example.com",
  "password": "SecurePass123!",
  "role": "Developer"
}

// Response 201
{
  "id": "guid",
  "fullName": "Yavuz Çağ",
  "email": "yavuz@example.com",
  "role": "Developer",
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### POST /auth/login
```json
// Request
{
  "email": "yavuz@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresAt": "2026-03-25T12:00:00Z"
}
```

---

## Project Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/projects` | Kullanıcının projelerini listele | Required |
| GET | `/projects/{id}` | Proje detayı | Required |
| POST | `/projects` | Yeni proje oluştur | Required |
| PUT | `/projects/{id}` | Proje güncelle | Owner/Admin |
| DELETE | `/projects/{id}` | Proje sil | Owner/Admin |

### POST /projects
```json
// Request
{
  "name": "TaskFlow Backend",
  "description": "API geliştirme projesi"
}

// Response 201
{
  "id": "guid",
  "name": "TaskFlow Backend",
  "description": "API geliştirme projesi",
  "ownerId": "guid",
  "createdAt": "2026-03-24T10:00:00Z"
}
```

---

## Task Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/projects/{projectId}/tasks` | Projedeki görevleri listele | Required |
| GET | `/tasks/{id}` | Görev detayı | Required |
| POST | `/projects/{projectId}/tasks` | Yeni görev oluştur | Required |
| PUT | `/tasks/{id}` | Görev güncelle | Required |
| PATCH | `/tasks/{id}/status` | Durum değiştir | Required |
| PATCH | `/tasks/{id}/assign` | Görev ata | PM/Admin |
| DELETE | `/tasks/{id}` | Görev sil | Owner/Admin |

### POST /projects/{projectId}/tasks
```json
// Request
{
  "title": "User entity oluştur",
  "description": "Domain katmanında User entity'si oluşturulacak",
  "priority": "High",
  "assigneeId": "guid",
  "dueDate": "2026-03-30T00:00:00Z"
}

// Response 201
{
  "id": "guid",
  "title": "User entity oluştur",
  "description": "Domain katmanında User entity'si oluşturulacak",
  "status": "Todo",
  "priority": "High",
  "projectId": "guid",
  "assigneeId": "guid",
  "createdBy": "guid",
  "dueDate": "2026-03-30T00:00:00Z",
  "createdAt": "2026-03-24T10:00:00Z"
}
```

### PATCH /tasks/{id}/status
```json
// Request
{
  "status": "InProgress"
}

// Response 200
{
  "id": "guid",
  "status": "InProgress",
  "updatedAt": "2026-03-24T11:00:00Z"
}
```

---

## Comment Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/tasks/{taskId}/comments` | Görev yorumlarını listele | Required |
| POST | `/tasks/{taskId}/comments` | Yorum ekle | Required |
| DELETE | `/comments/{id}` | Yorum sil | Owner/Admin |

---

## Ortak Response Formatı

### Başarılı
```json
{
  "success": true,
  "data": { ... },
  "message": null
}
```

### Hata
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email adresi geçersiz" }
  ]
}
```

### Pagination
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalCount": 45,
    "totalPages": 3
  }
}
```

---

## HTTP Status Code Kullanımı

| Code | Kullanım |
|------|----------|
| 200 | Başarılı GET, PUT, PATCH |
| 201 | Başarılı POST (yeni kayıt) |
| 204 | Başarılı DELETE |
| 400 | Validation hatası |
| 401 | Auth gerekli (token yok/geçersiz) |
| 403 | Yetki yok (token geçerli ama izin yok) |
| 404 | Kayıt bulunamadı |
| 409 | Conflict (duplicate email vb.) |
| 500 | Sunucu hatası |
