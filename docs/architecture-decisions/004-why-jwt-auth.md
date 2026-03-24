# ADR-004: JWT + ASP.NET Identity ile Authentication

**Tarih:** 2026-03-24
**Durum:** Accepted

---

## Bağlam

Kullanıcı kimlik doğrulama ve yetkilendirme mekanizmasına karar verilmesi gerekiyor.

## Karar

**ASP.NET Identity + JWT Bearer Token + Refresh Token** kullanılacak.

## Nedenler

### 1. ASP.NET Identity
- Kullanıcı yönetimi (register, login, password hashing) hazır geliyor
- Role management built-in
- EF Core ile entegre, migration desteği
- Güvenlik best practice'leri uygulanmış (password hashing, lockout vb.)

### 2. JWT Bearer Token
- Stateless: Sunucu tarafında session tutmaya gerek yok
- Scalable: Birden fazla API instance'ı aynı token'ı doğrulayabilir
- Frontend-friendly: Next.js ile kolay entegrasyon
- Claims-based: Kullanıcı bilgileri token içinde taşınır

### 3. Refresh Token
- Kısa ömürlü access token (15-30 dk) + uzun ömürlü refresh token
- Güvenlik: Çalınan access token kısa sürede expire olur
- UX: Kullanıcı sürekli login olmak zorunda kalmaz

## Token Akışı

```
1. Login → Access Token (30dk) + Refresh Token (7gün)
2. API Request → Authorization: Bearer {access-token}
3. Token Expired → POST /auth/refresh-token → Yeni token çifti
4. Refresh Token Expired → Tekrar login gerekli
```

## Alternatifler

| Yaklaşım | Avantaj | Dezavantaj |
|-----------|---------|------------|
| Session-based | Basit, server-side kontrol | Stateful, scale zorluğu |
| JWT | Stateless, scalable | Token revocation zorluğu |
| OAuth2/OpenID | Standart, 3rd party login | Karmaşık, bu proje için overkill |

## Sonuç

JWT + Refresh Token, bu projenin ihtiyaçlarına en uygun çözüm. Stateless yapısı ileride microservice'e geçişte de avantaj sağlar.
