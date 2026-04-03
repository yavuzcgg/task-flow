# Plan 015: Tema Özelleştirme Sayfası (Phase 9)
**Tarih:** 2026-04-03

## Yapılanlar
1. Settings sayfası (`/settings`):
   - Profil bilgileri: ad soyad, e-posta, rol (read-only)
   - Tema modu: Açık / Koyu / Sistem (next-themes ile)
   - Renk teması: 7 renk seçeneği (Slate, Blue, Green, Orange, Red, Purple, Rose)
   - Renk seçimi localStorage'da saklanır
   - data-theme attribute ile HTML'e uygulanır (ileride CSS variables ile tam entegrasyon)

## Dosyalar
- `frontend/src/app/(dashboard)/settings/page.tsx` (yeni)

## Notlar
- Renk teması şu an sadece seçim mekanizması — CSS variables'a bağlanması Phase 9+ için
- Profil düzenleme backend endpoint'i eklendiğinde form'a dönüştürülebilir
