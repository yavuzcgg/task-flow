# Plan 012: Task Detay + Yorumlar (Phase 6)
**Tarih:** 2026-04-02

## Yapılanlar
1. Task detay sayfası (`/projects/[id]/tasks/[taskId]`):
   - Görev başlığı, durum badge'i (Türkçe label + renk), öncelik badge'i
   - Açıklama, bitiş tarihi, oluşturulma tarihi
   - Geri butonu → proje kanban board'una
2. CommentSection bileşeni:
   - Yorum listesi (paginated, pageSize: 50)
   - Yorum ekleme formu (Textarea + Send butonu)
   - Yorum silme (sadece kendi yorumlarını, hover'da görünür)
   - Boş durum mesajı
3. Kanban kartlarına task detay linki eklendi

## Dosyalar
- `frontend/src/app/(dashboard)/projects/[id]/tasks/[taskId]/page.tsx` (yeni)
- `frontend/src/components/comment-section.tsx` (yeni)
- `frontend/src/components/kanban/kanban-card.tsx` (güncellendi — Link eklendi)
