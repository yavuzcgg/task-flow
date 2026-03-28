# Plan: FluentValidation Entegrasyonu
**Tarih:** 2026-03-28

## Context
DTO'larda `required` keyword var ama business validation yok (email formatı, min/max length, boş string kontrolü). FluentValidation ile her Request DTO için ayrı validator yazıp, validation pipeline'ına bağlayacağız. Validation hatalarında middleware 400 döner.

## Adımlar

### 1. NuGet Paketi
**Application .csproj'a:**
- `FluentValidation.DependencyInjectionExtensions` (11.*)

### 2. Validator'lar (Application/Validators/)
- RegisterRequestValidator, LoginRequestValidator
- CreateProjectRequestValidator, UpdateProjectRequestValidator
- CreateTaskRequestValidator, UpdateTaskRequestValidator, UpdateTaskStatusRequestValidator
- CreateCommentRequestValidator

### 3. Validation Filter (API/Filters/)
- ActionFilter olarak validation pipeline'ı
- Validation başarısızsa 400 + field bazlı hata detayları

### 4. DI Kaydı + ErrorResponse güncelle

## Doğrulama
- `dotnet build` → 0 hata
- API testi: boş email ile register → 400 + validation errors
- Commit
