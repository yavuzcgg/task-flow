# Plan 009: Auth Pages + Layout System (Phase 2-3)
**Tarih:** 2026-04-02

## Phase 2: Auth Sayfaları
1. Backend'e CORS eklendi (`localhost:3000`, AllowCredentials)
2. Auth layout: centered card, AuthGuard ile giriş yapanları dashboard'a yönlendirir
3. Login sayfası (`/login`): email + şifre, JWT token Zustand store'a kaydedilir
4. Register sayfası (`/register`): ad soyad + email + şifre + şifre tekrar, validation hataları gösterir
5. AuthGuard bileşeni: hydrate + yönlendirme + loading spinner
6. Root sayfa `/` → `/login` redirect

## Phase 3: Layout Sistemi
1. Sidebar: Dashboard, Projeler, Ayarlar linkleri + Admin kullanıcılar için Admin Panel
2. Navbar: kullanıcı adı, tema toggle (Moon/Sun), çıkış butonu, mobil menü butonu
3. ThemeToggle: Light/Dark tema geçişi
4. MobileSidebar: Responsive sidebar (backdrop + slide-in)
5. Dashboard layout: Sidebar + Navbar + AuthGuard wrapper

## Dosyalar
- `backend/src/TaskFlow.API/Program.cs` (CORS eklendi)
- `frontend/src/app/(auth)/layout.tsx`
- `frontend/src/app/(auth)/login/page.tsx`
- `frontend/src/app/(auth)/register/page.tsx`
- `frontend/src/components/auth-guard.tsx`
- `frontend/src/components/layout/sidebar.tsx`
- `frontend/src/components/layout/navbar.tsx`
- `frontend/src/components/layout/theme-toggle.tsx`
- `frontend/src/components/layout/mobile-sidebar.tsx`
- `frontend/src/app/(dashboard)/layout.tsx`
- `frontend/src/app/(dashboard)/dashboard/page.tsx`
