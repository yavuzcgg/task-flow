# Clean Architecture - Öğrenme Notları

> Bu dosya, proje boyunca öğrenilen Clean Architecture kavramlarını içerir.

---

## Temel Prensip: Dependency Rule

```
Dış katmanlar iç katmanlara bağımlıdır, tam tersi ASLA.

    API → Infrastructure → Application → Domain
    (dış)                                 (iç)
```

- Domain hiçbir şeyi bilmez (saf C# class'ları)
- Application sadece Domain'i bilir
- Infrastructure, Application'daki interface'leri implement eder
- API her şeyi DI ile birbirine bağlar

---

## Neden "TaskItem" ve "User" ayrı?

Domain entity'leri veritabanı tablolarını temsil etmez. Onlar **iş kurallarını** temsil eder:
- `TaskItem.ChangeStatus()` → sadece geçerli geçişlere izin ver
- `Project.AddMember()` → maksimum üye sayısını kontrol et

Entity = Data + Business Rules

---

## Interface Nerede Tanımlanır?

**YANLIŞ:** Infrastructure'da interface tanımlayıp Application'dan çağırmak
```
Infrastructure/ITaskRepository.cs  ← YANLIŞ
Application/TaskService.cs → Infrastructure'a bağımlı olur
```

**DOĞRU:** Application'da interface tanımlayıp Infrastructure'da implement etmek
```
Application/Interfaces/ITaskRepository.cs  ← DOĞRU
Infrastructure/Repositories/TaskRepository.cs → Application'a bağımlı
```

Bu sayede Application katmanı veritabanı teknolojisini bilmeden çalışır.

---

## DI (Dependency Injection) Nasıl Çalışıyor?

```csharp
// API/Extensions/ServiceExtensions.cs
services.AddScoped<ITaskRepository, TaskRepository>();
services.AddScoped<IUnitOfWork, UnitOfWork>();
services.AddScoped<ITaskService, TaskService>();
```

- `AddScoped`: Her HTTP request için bir instance
- `AddTransient`: Her inject edildiğinde yeni instance
- `AddSingleton`: Uygulama ömrü boyunca tek instance

Repository ve DbContext için **Scoped** kullanılır (request başına bir transaction).

---

## Notlar (Proje İlerledikçe Eklenecek)

- ...
