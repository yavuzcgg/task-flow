# Plan: Global Exception Middleware
**Tarih:** 2026-03-28

## Context
Controller'larda try-catch blokları var (AuthController), Service'lerde exception throw ediliyor (InvalidOperationException, UnauthorizedAccessException). Bu yaklaşım:
- Her controller'da aynı catch bloklarını tekrarlatır
- Yeni exception tipi ekleyince tüm controller'ları güncellemen gerekir
- Beklenmeyen hatalar yakalanmaz (500 error)

Çözüm: Merkezi exception middleware + custom exception class'ları.

## Oluşturulacak Dosyalar

### 1. Custom Exception'lar (Application katmanı)
**`Application/Exceptions/NotFoundException.cs`** → 404
**`Application/Exceptions/ConflictException.cs`** → 409
**`Application/Exceptions/UnauthorizedException.cs`** → 401
**`Application/Exceptions/BadRequestException.cs`** → 400

Her biri basit class, sadece message alır. Application katmanında çünkü service'ler bunları fırlatır.

### 2. Error Response DTO
**`Application/DTOs/Common/ErrorResponse.cs`** → { statusCode, message, errors? }

### 3. Exception Middleware (API katmanı)
**`API/Middleware/ExceptionHandlingMiddleware.cs`**
- Her request'i try-catch ile sarar
- Exception tipine göre HTTP status code belirler:
  - NotFoundException → 404
  - ConflictException → 409
  - UnauthorizedException → 401
  - BadRequestException → 400
  - Diğer → 500 (Internal Server Error)
- JSON ErrorResponse döner
- Development'ta stack trace ekler

### 4. Program.cs güncelle
- `app.UseMiddleware<ExceptionHandlingMiddleware>();` ekle (pipeline'ın en başına)

### 5. Service'leri güncelle
- AuthService: `InvalidOperationException` → `ConflictException` / `BadRequestException`
- AuthService: `UnauthorizedAccessException` → `UnauthorizedException`

### 6. Controller'ları temizle
- AuthController: try-catch kaldır, direkt service çağır
- ProjectsController, TasksController, CommentsController: null check'leri service'e taşı (service NotFoundException fırlatır)

## Doğrulama
- `dotnet build` → 0 hata
- API testi: yanlış login → 401 JSON, duplicate email → 409 JSON, olmayan proje → 404 JSON
- Commit (co-author yok)
