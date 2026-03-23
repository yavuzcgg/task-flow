# ADR-002: Neden PostgreSQL?

## Tarih
2026-03-19

## Durum
Kabul edildi

## Karar
SQL Server yerine PostgreSQL kullanıyoruz.

## Neden?

1. **Ücretsiz ve açık kaynak** - SQL Server lisansı pahalı, PostgreSQL tamamen ücretsiz
2. **Docker-friendly** - Resmi image, Alpine varyantı ile çok küçük boyut
3. **Cross-platform** - Linux sunucularda sorunsuz çalışır (deploy için önemli)
4. **Industry trend** - Startuplar ve modern projeler PostgreSQL'e yöneliyor
5. **EF Core desteği** - Npgsql provider ile tam uyum
6. **JSON desteği** - JSONB tipi ile NoSQL benzeri esneklik

## Alternatifler

| DB | Artı | Eksi |
|----|------|------|
| SQL Server | .NET ile doğal uyum, SSMS | Lisans maliyeti, Docker image büyük |
| PostgreSQL | Ücretsiz, hafif, modern | SSMS yok (pgAdmin var) |
| MySQL | Yaygın, basit | Stored procedure desteği zayıf |

## Sonuç
DevOps öğrenme hedefimiz için PostgreSQL ideal: Docker ile saniyeler içinde ayağa kalkar, ücretsiz, ve gerçek dünya projelerinde yaygın.
