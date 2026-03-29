# Plan: SignalR Real-Time Entegrasyonu
**Tarih:** 2026-03-29

## Context
Task durumu değiştiğinde, yeni görev/yorum eklendiğinde aynı projedeki kullanıcılara anlık bildirim gitmesi gerekiyor.

## Değişiklikler
1. TaskHub: proje bazlı gruplar (JoinProject/LeaveProject)
2. NotificationMessage DTO
3. TaskService + CommentService'e IHubContext inject
4. Program.cs: AddSignalR + MapHub
5. JWT'ye SignalR query string token desteği
