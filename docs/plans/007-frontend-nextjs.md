# Plan: Frontend - Next.js 14
**Tarih:** 2026-03-29

## Kararlar
- **Framework:** Next.js 14 (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **Tema:** Light/Dark toggle + özelleştirilebilir renk temaları (kırmızı, mor, mavi, yeşil vb.)
- **Admin Panel:** Ayrı /admin route, kendi layout + sidebar
- **Kanban:** İlk aşamada, sürükle-bırak (dnd-kit veya @hello-pangea/dnd)
- **State:** Zustand veya React Context
- **HTTP:** Axios veya fetch + SWR/React Query

## Sayfa Yapısı

### Public (Auth)
- `/login` — giriş formu
- `/register` — kayıt formu

### User Dashboard
- `/dashboard` — özet: projelerim, son aktiviteler
- `/projects` — proje listesi
- `/projects/[id]` — proje detay + kanban board
- `/projects/[id]/tasks/[taskId]` — task detay + yorumlar
- `/settings` — tema ayarları, profil düzenleme

### Admin Panel (/admin)
- `/admin` — admin dashboard (kullanıcı sayısı, proje sayısı, istatistikler)
- `/admin/users` — kullanıcı yönetimi (rol değiştir, aktif/pasif)
- `/admin/projects` — tüm projeler
- `/admin/tasks` — tüm görevler

## Tema Sistemi
- CSS variables ile renk temaları
- shadcn/ui'ın built-in theme sistemi
- `next-themes` ile light/dark toggle
- Renk seçenekleri: Slate, Red, Orange, Green, Blue, Purple, Rose
- Kullanıcı seçimi localStorage'da saklanır

## Faz Sırası
1. Next.js + Tailwind + shadcn/ui kurulumu
2. Auth sayfaları (Login, Register) + JWT entegrasyonu
3. Layout (Sidebar, Navbar, tema toggle)
4. Dashboard + Proje listesi
5. Kanban board (sürükle-bırak)
6. Task detay + yorumlar
7. Admin panel
8. SignalR entegrasyonu (real-time)
9. Tema özelleştirme sayfası
