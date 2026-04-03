# Plan 014: SignalR Entegrasyonu (Phase 8)
**Tarih:** 2026-04-03

## Kararlar
- @microsoft/signalr client kütüphanesi kullanıldı
- Hub URL: /hubs/tasks (JWT auth, accessTokenFactory ile)
- withAutomaticReconnect() ile bağlantı yönetimi
- useSignalR custom hook ile proje bazlı event dinleme

## Backend SignalR Yapısı
- Hub: TaskHub (JoinProject/LeaveProject group management)
- Event: "ReceiveNotification" → NotificationMessage { Type, Data, ProjectId, Timestamp }
- Types: TaskCreated, TaskStatusChanged, TaskDeleted, CommentAdded

## Yapılanlar
1. SignalR client modülü (`lib/signalr.ts`): connection yönetimi, start/stop, joinProject/leaveProject
2. useSignalR hook (`hooks/use-signalr.ts`): proje bazlı event listener, cleanup on unmount
3. Proje detay sayfasına real-time entegrasyon:
   - TaskCreated → yeni görev kanban'a eklenir + toast bildirimi
   - TaskStatusChanged → görev kartı güncellenir
   - TaskDeleted → görev kanban'dan kaldırılır

## Dosyalar
- `frontend/src/lib/signalr.ts` (yeni)
- `frontend/src/hooks/use-signalr.ts` (yeni)
- `frontend/src/app/(dashboard)/projects/[id]/page.tsx` (güncellendi)
