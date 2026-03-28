# Plan: Role-Based Authorization
**Tarih:** 2026-03-28

## Context
JWT token'da ClaimTypes.Role zaten var. Şu an herkes her şeyi yapabiliyor.
Sahiplik kontrolü + Admin bypass + register'da rol seçimi ekleniyor.

## Değişiklikler
1. RegisterRequest'e Role alanı
2. Service'lerde sahiplik kontrolü (OwnerId/CreatedById/AuthorId)
3. Controller'larda userId service'e geçiriliyor
4. Admin tüm kontrolleri bypass eder
