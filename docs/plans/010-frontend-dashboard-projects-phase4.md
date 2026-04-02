# Plan 010: Dashboard + Proje Listesi (Phase 4)
**Tarih:** 2026-04-02

## Yapılanlar
1. Ek shadcn/ui bileşenleri: dialog, badge, skeleton, dropdown-menu, separator, textarea
2. ProjectCard bileşeni: proje adı (Link), açıklama, tarih, DropdownMenu (düzenle/sil), Badge (isPublic)
3. CreateProjectDialog: name + description formu, sonner toast ile başarı bildirimi
4. Dashboard sayfası zenginleştirildi:
   - Hoş geldin mesajı + "Yeni Proje" butonu
   - Stats kartı: toplam proje sayısı (Skeleton loading)
   - Son 5 proje grid'i (responsive 1/2/3 kolon)
   - Boş durum: ikon + mesaj + CTA
5. Projeler sayfası (`/projects`):
   - Proje grid'i (pageSize: 9, responsive)
   - Boş durum: FolderKanban ikonu + "Henüz proje yok"
   - Sayfalama: Önceki/Sonraki butonları + "Sayfa X / Y"
   - Silme: window.confirm() ile onay

## Dosyalar
- `frontend/src/components/project-card.tsx`
- `frontend/src/components/create-project-dialog.tsx`
- `frontend/src/app/(dashboard)/dashboard/page.tsx` (güncellendi)
- `frontend/src/app/(dashboard)/projects/page.tsx` (yeni)
- shadcn/ui: badge, dialog, skeleton, dropdown-menu, separator, textarea
