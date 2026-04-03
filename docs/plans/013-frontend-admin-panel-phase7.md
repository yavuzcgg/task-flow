# Plan 013: Admin Panel (Phase 7)
**Tarih:** 2026-04-03

## Kararlar
- Backend'de admin-specific endpoint'ler henüz yok
- Admin panel mevcut API'lerle temel istatistikleri gösterir
- Users, projects, tasks sayfaları placeholder — backend endpoint'leri eklendikçe doldurulacak

## Yapılanlar
1. AdminGuard bileşeni: sadece Admin rolüne izin verir, diğerlerini /dashboard'a yönlendirir
2. Admin layout: kendi sidebar'ı (Dashboard, Kullanıcılar, Projeler, Görevler + "Ana Sayfaya Dön")
3. Admin dashboard: proje sayısı istatistik kartı + "geliştirme aşamasında" bilgi kartı
4. Placeholder sayfalar: /admin/users, /admin/projects, /admin/tasks — "Yakında" mesajı + gerekli endpoint açıklaması

## Dosyalar
- `frontend/src/components/admin-guard.tsx` (yeni)
- `frontend/src/app/admin/layout.tsx` (yeni)
- `frontend/src/app/admin/page.tsx` (yeni)
- `frontend/src/app/admin/users/page.tsx` (yeni)
- `frontend/src/app/admin/projects/page.tsx` (yeni)
- `frontend/src/app/admin/tasks/page.tsx` (yeni)

## Notlar
- Sidebar'daki "Admin Panel" linki sadece Admin rolünde gösteriliyor (sidebar.tsx'te zaten var)
- Backend'e eklenecek endpoint'ler: GET /admin/users, GET /admin/projects (tüm projeler), GET /admin/tasks (tüm görevler)
