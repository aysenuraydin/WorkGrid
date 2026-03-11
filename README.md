<div align="center">
  <h1>🚀 WorkGrid </h1>
  <p><strong>WorkGrid: Yeni Nesil No-Code İşletim Sistemi</strong></p>
  <p><em>"Sadece bir yazılım kullanmayın. Kendi ekosisteminizi dakikalar içinde inşa edin."</em></p>
  <p>İşletmelerin tek satır kod yazmadan kendi yazılım mimarilerini dakikalar içinde kurmalarını sağlayan yeni nesil <strong>PaaS (Platform as a Service)</strong> ve <strong>BaaS (Backend as a Service)</strong> ekosistemi.</p>
</div>

---

## 📖 Genel Bakış

WorkGrid, işletmelerin ve kurumların kendi markaları altında kod yazmadan profesyonel yazılım ekosistemleri inşa etmelerini sağlayan bulut tabanlı bir "Uygulama İnşa Platformu" (PaaS) dır.

Bu sadece sıradan bir SaaS uygulaması değildir; bu bir **Yazılım Fabrikası**dır (Software Factory). Sektördeki firmaların birbirine benzer yazılımları (CRM'ler, ERP'ler, Lojistik Panelleri) sıfırdan ve tekrar tekrar kurgulaması problemine kesin bir çözüm sunar.

Projenin kalbinde, tamamen özelleştirilebilir ve güçlü bir Backend-as-a-Service motoru olan **GridBase** yatar (Firebase veya Supabase benzeri, ancak tamamen kontrolünüzde). Bunun üzerine inşa edilen **WorkGrid**, teknik olmayan kullanıcıların bile ilişkisel veritabanları (Relational Databases) tasarlayabileceği, hesaplamalı (computational) kolonlar oluşturabileceği, API endpoint'leri ve dinamik formları çalışma anında (runtime) otomatik olarak üretebileceği esnek, sürükle-bırak destekli bir Dinamik Şema (Dynamic Schema) arayüzü sunar.

### ✨ Öne Çıkan Özellikler

- **🏢 White-Label (Marka Özgürlüğü):** Kurumlar kendi logolarını, renk paletlerini ve Navbar tasarımlarını kullanarak platformu tamamen kendi markalarına dönüştürebilir.
- **🌐 Custom Domain (CNAME) Desteği:** `www.musteri.com` gibi tamamen bağımsız alan adları üzerinden kusursuz hizmet verme imkanı.
- **📊 Akıllı Hücre Motoru ve İlişkisel Mimariler (Smart Cell Engine):** Excel tanıdıklığında hücre bazlı veri yönetimi. Dinamik tablolar oluşturun, ilişkiler kurun (1-N, N-N), `Toplam Maliyet = Fiyat * Miktar` gibi formüller tanımlayın.
- **🔌 Modüler Çözümler:** CRM, ERP, E-Ticaret ve Randevu sistemi gibi kurumsal modülleri tek tıkla kurup aktif edin.
- **🎨 Dinamik Arayüz (Layout) Özelleştirme:** Kullanıcıların kendi iş akışlarına göre kişiselleştirebildiği profesyonel arayüzler (Sadece okunabilir (Readonly), gizli (Hidden), zorunlu (Required) inputlar, `col-md-6` gibi özel grid boyutlandırmaları).
- **Kurumsal Multi-Tenancy (Çoklu Kiracı):** Tek bir kod tabanı üzerinden, birbirlerinden tamamen izole edilmiş, kendilerine ait özel CNAME'leri ve çalışma alanları (workspaces) olan yüzlerce farklı müşteriye hizmet verebilen altyapı.

---

## 🏗️ Mimari & Mühendislik (Çekirdek Sistem)

Bu platform, performanstan ödün vermeden devasa ve dinamik veri operasyonlarını yönetecek şekilde inşa edilmiştir. Sistem, katı bir şekilde **Domain-Driven Design (DDD)** ve **Clean Architecture** prensiplerini takip eder.

### ⚙️ Backend (GridBase) - *Motor*
- **Framework:** .NET Core 8+ (C#)
- **Mimari:** Clean Architecture, Domain-Driven Design (DDD). 
  - *Zengin Domain Modelleri (Rich Domain Models):* İş kuralları doğrudan Domain katmanına gömülmüştür (Örn. `IsLocked` kuralı Controller'da değil, doğrudan Entity'nin kalbinde yaşar).
- **Çekirdek Motor (Core Engine):** Dinamik *tableOrder* algoritması ve normalize edilmiş veri akışı.
- **Tasarım Şablonları (Patterns):** 
  - **CQRS & MediatR:** Okuma (Read) ve Yazma (Write) sorumluluklarının kesin ayrımı. Ön bellek temizliği (Cache Invalidation) gibi cross-cutting concern'ler Pipeline Behavior'lar ile merkezileştirilmiştir.
  - **Repository & Unit of Work:** PostgreSQL üzerinde Entity Framework Core kullanımı. Birbiriyle ilişkili dinamik hücreler ve kaskat (cascade) silme işlemleri, veri tutarlılığını sağlamak için tek bir *Transaction* (işlem bütünlüğü) içinde gerçekleşir.
  - **Aspect-Oriented Programming (AOP):** İş mantığını (business logic) kirletmeden; loglama, hata yakalama (exception handling) ve denetim (auditing) işlemleri Interceptor'lar ile yönetilir.
- **Altyapı (Infrastructure):** Multi-tenant mimari (Tek kod tabanı, yüzlerce izole müşteri alanı).

### 🎨 Frontend (WorkGrid) - *Arayüz*
- **Framework:** React, TypeScript (%100 Tip Güvenliği - Type-Safe), Ant Design (UI).
- **Hücresel State Yönetimi (Redux & Thunk):** Ekranda sadece değişen veriyi algılayıp render eden mimari. Bütün tabloyu yeniden yüklemek yerine, bir hücre güncellendiğinde *sadece* o hücrenin React DOM'u render olur.
- **Yüksek Performanslı Sanal Kaydırma (Virtualization):** Binlerce satırlık veri, DOM'u dondurmadan "Virtual Scrolling" mimarisiyle akıcı bir şekilde ekranda listelenir.

---

## 🌍 Ölçeklenebilirlik & Vizyon

WorkGrid, geleneksel yazılım süreçlerindeki "her müşteri için ayrı kod" yükünü ortadan kaldırır. Tek bir merkezi çekirdek üzerinden, yüzlerce farklı kuruma saniyeler içinde kurulum yapabilen bir mimari sunar.

Her yeni müşteri için sıfırdan kod yazmak yerine; hazır şablonlar ve dinamik konfigürasyonlar (Dynamic Configurations) sayesinde kurumların kendi sistemlerini dakikalar içinde "aktif etmesini" sağlar.

---

## 🛠️ Geliştirme Yol Haritası (Development Roadmap)
*(Durum: Aktif Geliştirme Süreci)*

- [ ] **Dinamik Kolon Yönetimi:** Akıllı sıralama (moveUp/Down) ve tableOrder stabilizasyonu.
- [ ] **Tema Özelleştirme Katmanı:** Dinamik renk ve logo yönetim motoru.
- [/] **Hücre Düzenleme (Cell-based Editing):** Inline edit (satır içi düzenleme) ve veri validasyonu (Geliştiriliyor).
- [ ] **Sürükle & Bırak (Drag & Drop) Arayüzü:** Görsel yer değiştirme ve kullanıcı deneyimi optimizasyonu (Yakında).
- [ ] **GridBase Entegrasyonu:** Backend ile gerçek zamanlı veri senkronizasyonu (Yakında).

> *"Bu platform, kurumsal ihtiyaçlar için harcanan geliştirme süresini haftalardan dakikalara indiren, konfigüre edilebilir dinamik tablo yapıları ve akıllı ilişki motoruyla donatılmış bir Low-Code Framework'tür. Amacımız, yazılımda tekrarlanan ameleliği bitirip, tek bir güçlü çekirdek ile sınırsız sayıda sektörel çözüm üretmektir."*


<div align="center">
  <h1>🚀 WorkGrid </h1>
  <p><strong>WorkGrid: The Next-Gen No-Code OS</strong></p>
  <p><em>"Don't just use software. Build your own ecosystem in minutes."</em></p>
  <p>A next-generation <strong>PaaS (Platform as a Service)</strong> and <strong>BaaS (Backend as a Service)</strong> ecosystem that allows businesses to build their own software architectures, completely code-free, in minutes.</p>
</div>

---

## 📖 Overview

WorkGrid is a cloud-based "Application Building Platform" (PaaS) that enables businesses and institutions to build professional software ecosystems under their own brand without writing code.

It is not just another SaaS application; it's a **Software Factory**. It addresses the industry-wide problem of repeatedly rebuilding similar software (CRMs, ERPs, Logistic Panels) from scratch. 

At its core, **GridBase** acts as an immensely powerful Backend-as-a-Service engine (similar to Firebase or Supabase, but fully self-hosted and highly customizable). Built on top of it, **WorkGrid** provides a flexible, drag-and-drop Dynamic Schema UI where non-technical users can design relational databases, set computational columns, and auto-generate API endpoints and forms—all at runtime.

### ✨ Key Features

- **🏢 White-Label Empowerment:** Institutions can transform the platform completely into their own brand using their own logos, color palettes, and Navbar designs.
- **🌐 Custom Domain (CNAME) Support:** Ability to perfectly serve over completely independent domains like `www.client.com`.
- **📊 Smart Cell Engine & Relational Mapping:** Cell-based data management with the familiarity of Excel. Create dynamic tables, establish relationships (1-N, N-N), define formulas like `Total Cost = Price * Amount`, and support dynamic content seamlessly.
- **🔌 Modular Solutions:** 1-click install and activation of business modules such as CRM, ERP, E-Commerce, and Appointment systems.
- **🎨 Dynamic Layout Customization:** Professional user interfaces that users can personalize according to their own workflows (Readonly, Hidden, Required inputs, custom grid sizing like `col-md-6`).
- **Enterprise Multi-Tenancy:** Hundreds of distinct clients using the system with complete isolation, personalized CNAMEs, and independent workspaces.

---

## 🏗️ Architecture & Engineering (The Core)

This platform is engineered to handle massive, dynamic data operations without compromising performance. It strictly follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles.

### ⚙️ Backend (GridBase) - *The Engine*
- **Framework:** .NET Core 8+ (C#)
- **Architecture:** Clean Architecture, Domain-Driven Design (DDD). 
  - *Rich Domain Models:* Business logic is encapsulated in the domain (e.g., `IsLocked` rule inside Entity, not the controller).
- **Core Engine:** Dynamic *tableOrder* algorithm and normalized data flow.
- **Patterns:** 
  - **CQRS & MediatR:** Strict separation of reads and writes. Pipeline Behaviors are utilized for centralized cross-cutting concerns like Cache Invalidation.
  - **Repository & Unit of Work:** Entity Framework Core over PostgreSQL, ensuring complex dynamic relations and cascade deletes are processed safely within a single transaction.
  - **Aspect-Oriented Programming (AOP):** Interceptors for logging, auditing, and exception handling without polluting the business logic.
- **Infrastructure:** Multi-tenant architecture (Single code base, hundreds of isolated client areas).

### 🎨 Frontend (WorkGrid) - *The Interface*
- **Framework:** React, TypeScript (100% Type-Safe), Ant Design (UI).
- **Granular State Management (Redux):** Thunk mapping down to the `Cell` level. Avoids complete re-renders; when a cell updates, *only* that cell's DOM is re-rendered.
- **High-Performance Virtualization:** Virtual Scrolling efficiently renders thousands of rows without crashing the DOM.

---

## 🌍 Scalability & Vision

WorkGrid eliminates the burden of "separate code for every customer" in traditional software development processes. It provides an architecture that can be installed for hundreds of different institutions in seconds via a single central core.

Instead of writing code for every new customer; thanks to ready-made templates and dynamic configurations, it allows institutions to "activate" their own systems in minutes.

---

## 🛠️ Development Roadmap
*(Status: Active Development)*

- [ ] **Dynamic Column Management:** Smart sorting (moveUp/Down) and tableOrder stabilization.
- [ ] **Theme Customization Layer:** Dynamic color and logo management engine.
- [/] **Cell-based Editing:** Inline edit and data validation (In Progress).
- [ ] **Drag & Drop Interface:** Visual displacement and user experience optimization (Coming Soon).
- [ ] **GridBase Integration:** Real-time data synchronization with Backend (Coming Soon).

> *"This platform is a Low-Code Framework equipped with configurable dynamic table structures and a smart relationship engine that reduces the development time spent on enterprise needs from weeks to minutes. Our goal is to end repetitive drudgery in software and produce an unlimited number of sectoral solutions with a single powerful core."*
