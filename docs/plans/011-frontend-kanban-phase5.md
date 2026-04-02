# Plan 011: Kanban Board (Phase 5)
**Tarih:** 2026-04-02

## Kararlar
- Sürükle-bırak kütüphanesi: @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities
- 4 kolon: Todo (Yapılacak), InProgress (Devam Ediyor), InReview (İncelemede), Done (Tamamlandı)
- Optimistic UI: sürükleme sırasında anında güncelleme, API'ye async sync

## Yapılanlar
1. dnd-kit kuruldu
2. KanbanCard: sürüklenebilir task kartı, GripVertical handle, priority badge, due date, silme aksiyonu
3. KanbanColumn: droppable kolon, status renk göstergesi, görev sayısı, "+" butonu (sadece Todo)
4. KanbanBoard: DndContext, 4 kolon, DragOverlay, optimistic status update + API sync
5. CreateTaskDialog: başlık, açıklama, öncelik (select), bitiş tarihi (date input)
6. Proje detay sayfası (`/projects/[id]`): proje bilgileri + kanban board + geri butonu

## Dosyalar
- `frontend/src/components/kanban/kanban-board.tsx`
- `frontend/src/components/kanban/kanban-column.tsx`
- `frontend/src/components/kanban/kanban-card.tsx`
- `frontend/src/components/create-task-dialog.tsx`
- `frontend/src/app/(dashboard)/projects/[id]/page.tsx`
