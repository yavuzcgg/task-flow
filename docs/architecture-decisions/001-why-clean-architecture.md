# ADR-001: Neden Clean Architecture?

## Tarih
2026-03-19

## Durum
Kabul edildi

## Karar
Bu projede Clean Architecture (Robert C. Martin) kullanıyoruz.

## Neden?

### Problem
Klasik N-Layer (3 katmanlı) mimaride:
- Controller doğrudan DbContext'e erişir
- İş mantığı controller'a sızar
- Test yazmak zor (her şey birbirine bağımlı)
- Veritabanı değiştirmek = tüm projeyi yeniden yazmak

### Çözüm: Clean Architecture
Katmanlar içten dışa doğru:

```
[Domain] → [Application] → [Infrastructure + API]
  (iç)                        (dış)
```

**Altın Kural:** İç katman dış katmanı ASLA bilmez.

- **Domain:** Entity'ler, iş kuralları. Hiçbir NuGet paketi yok. Saf C#.
- **Application:** Use case'ler, DTO'lar, interface'ler. Sadece Domain'i bilir.
- **Infrastructure:** EF Core, PostgreSQL, email servisi. Application'daki interface'leri implement eder.
- **API:** Controller'lar, middleware. DI (Dependency Injection) ile her şeyi bağlar.

### Dependency Inversion Nasıl Çalışır?
```
Application katmanı: IUserRepository interface'ini TANIMLAR
Infrastructure katmanı: IUserRepository'yi EF Core ile IMPLEMENT eder
API katmanı: DI container'da ikisini BİRBİRİNE BAĞLAR
```

Böylece Application katmanı veritabanını bilmez. Yarın PostgreSQL'den MongoDB'ye geçsen sadece Infrastructure değişir.

## Alternatifler

| Mimari | Artı | Eksi |
|--------|------|------|
| N-Layer (3 katman) | Basit, hızlı başla | Katmanlar arası sıkı bağımlılık |
| Clean Architecture | Testable, değiştirilebilir | İlk kurulum daha uzun |
| Vertical Slice | Feature bazlı organizasyon | Küçük projelerde overkill olabilir |

## Sonuç
Clean Architecture seçtik çünkü:
1. **Testability:** Her katman izole test edilebilir
2. **Maintainability:** Değişiklik tek katmanı etkiler
3. **Industry standard:** Büyük şirketlerde yaygın
4. **SOLID uyumu:** Dependency Inversion doğal olarak uygulanır
5. **Öğrenme:** CQRS, DDD gibi ileri konulara geçiş için sağlam temel
