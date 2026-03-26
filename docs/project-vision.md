# TaskFlow - Proje Vizyonu

## Ne İnşa Ediyoruz?

TaskFlow, **Trello + Jira'dan ilham alan** ama daha basitleştirilmiş bir Task & Project Management API'sidir.

Gerçek dünya ürünlerinden ilham alıyoruz:
- **Trello:** Basit kanban board, sürükle-bırak, kart yapısı
- **Jira:** Proje yönetimi, rol bazlı yetkilendirme, detaylı görev takibi

Ama bunları sıfırdan, **Clean Architecture** prensiplerine uygun şekilde yazıyoruz.

## Neden Bu Proje?

Bu proje bir **öğrenme projesi**. Amaç:

1. **Clean Architecture'ı tam oturtmak** — katman ayrımı, Dependency Inversion, DI pattern'leri
2. **Gerçek dünya teknolojileri kullanmak** — JWT, SignalR, EF Core, Docker
3. **Junior → Mid-level geçişte referans proje** oluşturmak
4. **Sonraki proje için temel hazırlamak** — Onion Architecture + CQRS + MediatR

## Temel Özellikler

### MVP (Minimum Viable Product)
- [ ] Kullanıcı kayıt ve giriş (JWT + Refresh Token)
- [ ] Proje oluşturma ve yönetme (Public / Private)
- [ ] Görev (Task) CRUD operasyonları
- [ ] Görev atama ve durum değişikliği
- [ ] Yorum sistemi
- [ ] Rol bazlı yetkilendirme (Developer, PM, Admin)

### İleri Seviye
- [ ] Real-time güncellemeler (SignalR)
- [ ] Activity log (kim ne yaptı)
- [ ] Pagination ve filtering
- [ ] Kanban board (Frontend - Next.js)

### Gelecek Vizyonu (v2+)
- [ ] **AI entegrasyonu (Gemini API):**
  - Görev açıklamasından otomatik öncelik tahmini
  - Doğal dil ile görev arama
  - Akıllı görev atama önerileri
  - Sprint planlama asistanı
- [ ] Bildirim sistemi (email/push)
- [ ] Dosya ekleri (görevlere dosya yükleme)
- [ ] Dashboard ve raporlama

## Teknoloji Kararları

| Teknoloji | Neden | ADR |
|-----------|-------|-----|
| .NET 9 | Modern, performanslı, güçlü ekosistem | — |
| Clean Architecture | Öğrenme hedefi, test edilebilirlik | [ADR-001](architecture-decisions/001-why-clean-architecture.md) |
| PostgreSQL | Ücretsiz, Docker-friendly, endüstri standardı | [ADR-002](architecture-decisions/002-why-postgresql.md) |
| Repository + UoW | Soyutlama, test kolaylığı | [ADR-003](architecture-decisions/003-why-repository-pattern.md) |
| JWT Auth | Stateless, scalable | [ADR-004](architecture-decisions/004-why-jwt-auth.md) |
| FluentValidation | Temiz validation, ayrı sorumluluk | Faz 3'te |
| AutoMapper | Entity ↔ DTO dönüşümü | Faz 3'te |
| SignalR | Real-time web socket | Faz 6'da |

## Ne Yapmıyoruz (Non-goals)

- Production-ready Jira klonu yapmıyoruz
- Microservice mimarisi yok (monolith yeterli)
- Kubernetes/cloud deployment şu an hedef değil
- Mobile app yok (sadece web API + frontend)

## Öğrenme Yol Haritası

```
Bu Proje (TaskFlow)          → Clean Architecture + temel pattern'ler
  ↓
Sonraki Proje                → Onion Architecture + CQRS + MediatR
  ↓
Hedef                        → Herhangi bir mimari pattern'i güvenle uygulayabilmek
```
