# Plan 008: Frontend Scaffold (Phase 1)
**Tarih:** 2026-04-02

## Kararlar
- Next.js 15 (create-next-app@latest) + Tailwind v4 + shadcn/ui
- Axios + Zustand + next-themes
- App Router + src/ dizini + @/* import alias

## Yapılanlar
1. Next.js 15 projesi oluşturuldu (`frontend/`)
2. Ek bağımlılıklar kuruldu: axios, zustand, next-themes, lucide-react
3. shadcn/ui başlatıldı + temel bileşenler: button, card, input, label, sonner
4. Dizin yapısı: app/(auth), app/(dashboard), app/admin, components/layout, lib/api, stores, types, hooks, providers
5. Environment variables: `.env.local` + `.env.example`
6. TypeScript tipleri: Backend DTO'larıyla birebir eşleşen tipler (`types/index.ts`)
7. Axios API client: JWT interceptor + 401 handler (`lib/api/client.ts`)
8. API endpoint fonksiyonları: auth, projects, tasks, comments (`lib/api/index.ts`)
9. Zustand auth store: setAuth, logout, hydrate (`stores/auth-store.ts`)
10. Theme provider: next-themes wrapper (`providers/theme-provider.tsx`)
11. Root layout: ThemeProvider + Toaster + Geist font
12. Build doğrulaması başarılı
