# Plan: Pagination + Filtering
**Tarih:** 2026-03-28

## Context
Liste endpoint'leri tüm kayıtları döndürüyor. Sayfalama + task filtresi ekleniyor.

## Değişiklikler
1. PaginationParams + PagedResult<T> ortak DTO'lar
2. TaskFilterParams (status, priority, search)
3. Service'ler PagedResult döner
4. Controller'lar [FromQuery] ile parametreleri alır
