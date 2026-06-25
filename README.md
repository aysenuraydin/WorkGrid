<div align="center">

# 🟦 WorkGrid

### Verilerinizi şekillendirin, geleceğinizi şekillendirin.

**WorkGrid**, işletmelerin kendi yazılım ekosistemlerini **tek satır kod yazmadan**, dakikalar içinde inşa edebildiği yeni nesil bir **No-Code / PaaS (Platform as a Service)** platformudur. Kalbinde, tamamen sıfırdan geliştirilmiş **GridBase** adlı bir **BaaS (Backend as a Service)** motoru bulunur — tıpkı Firebase veya Supabase gibi, ancak baştan sona kendi kontrolünüzde ve tamamen özelleştirilebilir.

Tablo oluşturun, kolonları sürükleyerek tasarlayın, tablolar arası ilişkiler kurun, doğrulama kuralları ve hesaplama formülleri tanımlayın, kayıt modallarını görsel olarak özelleştirin — hepsi çalışma zamanında, koda dokunmadan.

`No-Code` · `PaaS + BaaS + SaaS` · `Multi-Tenant` · `White-Label` · `Clean Architecture` · `DDD` · `CQRS` · `40+ Input Tipi`

</div>

---

## 📖 İçindekiler

1. [WorkGrid Nedir?](#-workgrid-nedir)
2. [Felsefe ve Temel Kavramlar](#-felsefe-ve-temel-kavramlar)
3. [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
4. [GridBase — Dinamik Veri Motoru](#-gridbase--dinamik-veri-motoru)
5. [Hücre / Input Tipleri — Tam Referans](#-hücre--input-tipleri--tam-referans)
6. [Tablo Yönetim Yetenekleri](#-tablo-yönetim-yetenekleri)
7. [İlişkisel Veri Modeli & Relations Tab](#-ilişkisel-veri-modeli--relations-tab)
8. [Modal Tasarım Editörü](#-modal-tasarım-editörü)
9. [Multi-Tenant & White-Label](#-multi-tenant--white-label)
10. [Mimari](#-mimari)
11. [Backend Derinlemesine](#-backend-derinlemesine)
12. [Frontend Derinlemesine](#-frontend-derinlemesine)
13. [Güvenlik & Yetkilendirme](#-güvenlik--yetkilendirme)
14. [Modüller — Detaylı](#-modüller--detaylı)
15. [Teknoloji Yığını](#-teknoloji-yığını)
16. [Kurulum](#-kurulum)
17. [Proje Yapısı](#-proje-yapısı)
18. [Geliştirici Rehberi: Yeni Input Tipi Ekleme](#-geliştirici-rehberi-yeni-input-tipi-ekleme)
19. [🔮 Yol Haritası — Yakında Gelecekler](#-yol-haritası--yakında-gelecekler)
20. [Sık Sorulan Sorular](#-sık-sorulan-sorular)

---

## 🎯 WorkGrid Nedir?

Sektörde firmaların birbirine çok benzeyen yazılımları (CRM, ERP, e-ticaret panelleri, lojistik sistemleri) sürekli sıfırdan ve tekrar tekrar geliştirdiğini görüyoruz. Bu, devasa bir zaman ve iş gücü israfı. WorkGrid bu sorunu çözmek için doğdu.

WorkGrid sadece bir uygulama değil, bir **Yazılım Fabrikası**dır. Geleneksel "sabit şemalı" uygulamaların aksine, **veri yapısını son kullanıcının tanımladığı** bir platformdur. Bir tablo oluşturduğunuzda; o tablonun kolonlarını, tiplerini, görünümünü, doğrulama kurallarını, hesaplama formüllerini ve diğer tablolarla ilişkilerini tamamen siz belirlersiniz — veritabanı şemasını değiştirmeden, kod dağıtmadan, sadece arayüzden.

"Excel basitliğinde, ama Enterprise gücünde bir No-Code işletim sistemi" diye düşünebilirsiniz.

### Kimler için?
- **İşletmeler / KOBİ'ler:** İç süreçlerini Excel'den çıkarıp profesyonel panellere taşımak isteyenler — CRM, envanter, sipariş takibi, müşteri kayıtları.
- **Geliştiriciler:** Her yeni "tablo" için sıfırdan CRUD ekranı yazmaktan kurtulmak isteyenler. GridBase'i arkasına takıp BaaS olarak kullanabilirler.
- **Ürün ekipleri:** Hızlı prototipleme ve dahili araçlar (internal tools) inşa edenler.

### Üç katmanlı değer
| Katman | Ne sunar |
|--------|----------|
| **GridBase (BaaS)** | Dinamik şema, API, güvenlik ve ilişki motoru. Firebase/Supabase muadili, self-hosted. |
| **WorkGrid (PaaS)** | Sürükle-bırak dinamik tablolar ve UI ile üzerinde yazılım inşa edilen platform. |
| **Hazır Modüller (SaaS)** | E-Ticaret, CRM, Blog, Task gibi tek tıkla kurulabilen, çalışan modüller. |

---

## 🧭 Felsefe ve Temel Kavramlar

### Tek Yönlü Bağımlılık: WorkGrid → GridBase

Platformun çekirdeğinde **GridBase** yer alır — ürüne özel hiçbir bilgi içermeyen jenerik bir veri motoru. Tablo, satır, hücre, kolon ve ilişki kavramlarını yönetir ama "e-ticaret", "blog" veya "CRM" gibi hiçbir iş alanını bilmez.

> **Mimari kural:** GridBase, WorkGrid'i **asla** bilmez. Bağımlılık tek yönlüdür. Bu sayede aynı motor; CRM, e-ticaret, hastane randevu sistemi, okul yönetimi veya envanter gibi tamamen farklı senaryolarda yeniden kullanılabilir. GridBase ileride bağımsız bir BaaS ürünü olarak ayrılabilecek şekilde tasarlanmıştır.

### Temel Varlıklar (Entities)

| Kavram | Açıklama |
|--------|----------|
| **Datatable** | Bir veri tablosu. Kolonları, satırları, modal tasarımı, ilişkileri ve erişim ayarlarını içerir. |
| **TableColumn** | Bir kolon. Tipi (`InputTypeEnum`), genişliği, doğrulama ayarları, ilişki bilgisi (`realTableId`, `realColumnId`), fonksiyon metni içerir. |
| **TableRow** | Bir satır (kayıt). İçinde hücreler bulunur. |
| **TableCell** | Bir hücre — belirli bir satır ve kolonun kesişimindeki değer. |
| **ModalDesign** | Kayıt ekleme/düzenleme modalının görsel düzeni (kolon konumları, boşluklar, genişlikler). |
| **ForeignTableFk** | İki tablo arasındaki ilişki tanımı (hangi kolonun etiket gösterileceği dahil). |
| **TenantConfig** | Kiracıya (tenant) özel ayarlar, feature flag'ler, tema ve marka bilgisi. |

### EAV ↔ JSON Köprüsü
GridBase verileri arka planda **EAV (Entity-Attribute-Value)** modelinde tutar: `Datatable → TableRow → TableCell`. Ancak dışarıya, API üzerinden temiz ve tanıdık bir **JSON** olarak sunar:

```json
{
  "id": 5,
  "name": "deneme",
  "logoUrl": "deneme <3"
}
```

Kullanıcı bu JSON'u görür ve onunla çalışır; ama sistem aslında satır ve hücre olarak saklar. Bu, hem dinamik şema esnekliğini hem de geliştirici dostu bir API'yi aynı anda mümkün kılar. Firebase'in yaptığı her şeyi yapar, ama hem kullanıcı dostu arayüzü hem de hazır endpoint'leri vardır.

---

## ✨ Öne Çıkan Özellikler

- 🧱 **Dinamik Şema** — Çalışma zamanında tablo, kolon ve ilişki oluşturma; veritabanı migration'ı gerektirmez.
- 🎨 **40+ Dinamik Input Tipi** — Metinden QR koda, ilişkiden kullanıcı seçiciye, her veri türü için özel bileşen.
- 🔗 **Gerçek İlişkisel Veri** — Foreign Column (1-N, N-N) ve Parent (self-reference / hiyerarşi).
- 🧮 **Hesaplama Kolonları** — `amount * price = total` gibi formüllerle gerçek zamanlı hesaplama.
- ✅ **Dinamik Doğrulama** — Kolon bazında required, min/max, regex kuralları.
- 🖼️ **Görsel Modal Editörü** — Kayıt formlarını sürükle-bırak ile tasarlama, canlı önizleme.
- 🔐 **Dinamik İzinler** — Tablo bazında erişim seviyesini (Public/Authenticated/RoleBased/Owner) çalışma zamanında değiştirme.
- 🏢 **Multi-Tenant & White-Label** — İzole müşteriler, kendi logoları, renkleri ve domainleriyle.
- ⚡ **Gerçek Zamanlı** — SignalR/WebSocket ile canlı hücre güncellemeleri.
- 🚀 **Yüksek Performans** — Redis cache, event-driven invalidation, hücre bazlı memoization.
- 🎁 **Hazır Modüller** — Dinamik Landing, E-Ticaret, Blog, Task (Kanban), Calendar, Chat, Dashboard ve daha fazlası.

---

## 🗄️ GridBase — Dinamik Veri Motoru

GridBase, WorkGrid'in arkasındaki self-hosted BaaS motorudur. Firebase/Supabase'in sunduğu esnekliği, kendi altyapınızda ve gerçek ilişkisel veri desteğiyle sağlar.

### Yetenekler
- **EAV ↔ JSON köprüsü** — Esnek şema, tanıdık JSON arayüzü; otomatik tip çevrimi (number/bool/text/date...).
- **Dinamik CRUD** — `GetAll`, `GetById`, `GetPaged`, `Create`, `Update`, `Patch`, `Delete`.
- **PATCH (kısmi güncelleme)** — `null` = alanı temizle, alan yok = dokunma.
- **Gelişmiş sorgulama** — Filtreler: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`, `startsWith`, `endsWith`, `in`, `isNull`, `isNotNull`.
- **Foreign filtreleme** — İlişkili id listesinde arama.
- **Sıralama & Sayfalama** — Tip-duyarlı sıralama (sayı/tarih/metin farkı), `PagedResult` ile sayfalama.
- **Foreign kolon çözümleme** — İlişkili kaydın ham id'si yerine anlamlı etiketini döndürme (tekli + çoklu).
- **AccessLevel yetki** — `Public` / `Authenticated` / `RoleBased` / `Owner`; owner süzme (sadece kendi kayıtların), owner damgası (userId token'dan), admin bypass, 403 dönüşü.

### İki yüzlü kullanım
GridBase hem **kullanıcı dostu görsel arayüz** hem de **hazır API endpoint'leri** sunar. Kod yazmak istemeyen kullanıcı dinamik modaldan veri girer/görür/siler; geliştirici ise aynı veriye endpoint üzerinden erişir. Arayüzün yanında gönderilen JSON'u da görebilir — ne gönderdiğinizi şeffaf biçimde görürsünüz.

---

## 🧩 Hücre / Input Tipleri — Tam Referans

WorkGrid'in en güçlü yanı, her veri türü için özel tasarlanmış input bileşenleridir. Her tip hem **düzenleme modunda** (Input) hem de **liste/görüntüleme modunda** (Cell) ayrı bileşene sahiptir. Hangi bileşenin render edileceğine, GridBase'den gelen kolon tipine göre **çalışma zamanında** karar verilir (Component Factory).

### Metin Tipleri
| Tip | Veri Formatı | Açıklama |
|-----|-------------|----------|
| **Text / Tel** | Düz metin | Prefix/suffix, format kuralı (telefon vb.) |
| **Textarea** | Çok satırlı metin | Uzun metinler |
| **Email** | Metin | E-posta ikonlu, doğrulamalı |
| **HTML Editör** | HTML | CKEditor 5 zengin metin editörü |
| **HTML Kod** | HTML | Monaco Editor ile kod + canlı önizleme |

### Sayısal Tipler
| Tip | Veri Formatı | Açıklama |
|-----|-------------|----------|
| **Number** | Sayı | Artır/azalt, step, prefix/suffix, format |
| **Range** | Sayı | Kaydırıcı + anlık değer |
| **Ratings** | Sayı (0–5) | Yıldız, yarım yıldız desteği |

### Tarih & Zaman Tipleri
| Tip | Format |
|-----|--------|
| **Date** | `DD-MM-YYYY` |
| **DateTime** | `DD-MM-YYYY HH:mm` |
| **Time** | `HH:mm` |
| **Month** | `YYYY-MM` |
| **Week** | `YYYY-W` (ISO hafta) |
| **Quarter** | `YYYY-Q` |
| **Year** | `YYYY` |
| **Multiple Date** | Virgüllü tarihler |
| **Multiple Time** | `HH:mm-HH:mm` |

### Aralık (Range) Tipleri
`başlangıç - bitiş` formatında saklanır, `rangeLimit` ile sınırlanabilir: **Range Date**, **Range DateTime**, **Range Month**, **Range Week**, **Range Quarter**, **Range Year**.

### Seçim Tipleri
| Tip | Veri Formatı | Açıklama |
|-----|-------------|----------|
| **Select** | `,*,` ayraçlı | Tekli/çoklu açılır liste (react-select) |
| **Radio** | Tek değer | Seçenekli; seçeneksiz tekli (`*1*`/`*0*`) |
| **Checkbox** | `,*,` ayraçlı | Çoklu onay; seçeneksiz tekli |
| **Switch** | `*1*` / `*0*` | Aç/kapa anahtarı, primary renkli |

### İlişki Tipleri
| Tip | Veri Formatı | Açıklama |
|-----|-------------|----------|
| **Foreign Column** | `rowId` (virgüllü) | Başka tabloya bağlantı, etiket çözümlemeli |
| **Parent** | Ham `rowId` | Aynı tabloya self-reference (hiyerarşi) |

### Kişi & Etiket Tipleri
| Tip | Veri Formatı | Açıklama |
|-----|-------------|----------|
| **Users** | `userId` (virgüllü) | Kullanıcı seçici; avatar, baş harf, arama, tekli/çoklu |
| **Badges** | Virgüllü etiketler | Serbest etiket girişi, çıkarılabilir rozetler |

### Medya & Dosya Tipleri
| Tip | Açıklama |
|-----|----------|
| **Image** | Görsel yükleme + önizleme, sürükle-bırak |
| **Image Upload** | Ant Design çoklu görsel (picture-card) |
| **Video Manager** | Video yükleme, önizleme, indirme |
| **File / Drop** | Genel dosya, sürükle-bırak alanı |
| **View Image** | Görsel galerisi (Swiper) |

### Özel Tipler
| Tip | Veri Formatı | Açıklama |
|-----|-------------|----------|
| **Icon** | İkon class'ı (`ri-home-line`) | Aranabilir ikon seçici (Remix Icon) |
| **QR Code** | URL/metin | Girilen değerden canlı QR üretir |
| **Function** | Hesaplanmış sonuç | `{{kolonId}}` ile diğer kolonlara referanslı formül |

> **Function kolonları**, diğer kolonların değerlerini kullanarak çalışma zamanında hesaplama yapar. Örneğin `{{12}} * {{15}}` ifadesi, 12 ve 15 numaralı kolonların değerlerini çarpar (`amount * price = total`). Bağımlı kolonlar değiştikçe sonuç gerçek zamanlı, backend'e gitmeden güncellenir.

---

## 🛠️ Tablo Yönetim Yetenekleri

WorkGrid'i sıradan bir CRUD jeneratöründen ayıran, bir tabloyu **koda dokunmadan** uçtan uca yapılandırabilmenizdir.

### Dinamik Tablo İzinleri
Her tablonun erişim seviyesi (`AccessLevel`) çalışma zamanında değiştirilebilir:
- **Public** — Herkese açık
- **Authenticated** — Giriş yapmış kullanıcılar
- **RoleBased** — Belirli rollere
- **Owner** — Sadece kaydın sahibine (otomatik owner süzme + admin bypass)

### Dinamik Doğrulama (Validation)
Tabloya ve kolona, koda dokunmadan doğrulama kuralları tanımlanır: **zorunlu alan (required)**, **min/max**, **regex/format**. Kurallar `ColumnValidationConfig` ve `RulesValidationConfig` ile saklanır; doğrulama UI düzeyinde Formik şemasıyla anında çalışır.

### Property / UI Ayarları
Kolon bazında, koda dokunmadan: **readonly**, **hidden**, **required**, **genişlik** (12'lik grid, `col-md-6` gibi), **prefix/suffix**, **placeholder**, **autoFocus** ve daha fazlası.

### Kolonlar Arası Fonksiyonlar
Bir kolon, diğer kolonların değerlerine `{{kolonId}}` ile referans veren bir formül olabilir. Örneğin bir ürün tablosunda `Price` ve `Amount` kolonlarının üstüne `Total = Price * Amount` formülü tanımlanır; sistem bunu gerçek zamanlı, frontend düzeyinde otomatize eder.

### Dinamik CSS / Class
Tasarımda hücre ve kolon seviyesine kadar **inline CSS** ve **class** ekleyebilirsiniz. Görünüm tamamen kullanıcının kontrolündedir.

### Dinamik İlişkiler
Tablolar arası **1-N** ve **N-N** bağlantıları çalışma zamanında, görsel olarak kurulur (bkz. Relations Tab).

---

## 🔗 İlişkisel Veri Modeli & Relations Tab

WorkGrid, gerçek ilişkisel veriyi destekler ve bunu görsel bir **Relations (İlişki) sekmesi** üzerinden yönetir.

### Relations Tab
- Tablolar arası ilişkileri **görsel olarak** kurma.
- Dinamik ilişki tanımlama: **Foreign Column** ve **Parent (self-reference)**.
- İlişki kurarken: **görüntülenecek etiket kolonu** seçimi, **çoklu seçim (isMulti)**, **düzenlenebilirlik** ayarı.
- Self-reference için özel davranış: ters ilişki ve ayna kolonu **oluşturulmaz**.

### 1. Foreign Column (Tablolar Arası)
- **Bağ kolonu:** İlişkiyi tutan ana kolon (`realTableId` + `realColumnId` dolu).
- **Ayna (mirror) kolonları:** Bağlı tablodan görüntülenecek ek alanlar otomatik senkronize edilir.
- **Etiket çözümleme:** Bağlı kaydın hangi kolonunun etiket gösterileceği `createOrUpdateColumnId` ile belirlenir; ham `rowId` yerine anlamlı etiket görünür.
- **Ters ilişki:** Karşı tarafta otomatik ters bağ oluşturulur.

### 2. Parent (Self-Reference / Hiyerarşi)
Bir kayıt, **aynı tablodaki** başka bir kayda bağlanır. Kategori ağaçları, organizasyon şemaları, alt görevler için kullanılır.
- Tek yönlüdür — ters ilişki **oluşturulmaz**.
- Yalnızca tek bir `parentId` kolonu (`type = Parent`, `realTableId = kendi tablosu`, `realColumnId = null`).
- Backend'de gelen ilişkiler "self" ve "normal" olarak ayrıştırılır; normal akış self ilişkileri görmezden gelir.
- Kayıt kendine parent olamaz (seçenek listesinden çıkarılır).

---

## 🖼️ Modal Tasarım Editörü

Her tablo için kayıt ekleme/düzenleme modalı görsel olarak tasarlanır.

- **Sürükle-bırak yerleşim** — Kolonları modal içinde istediğiniz konuma taşıyın.
- **Boşluk kontrolü** — Her kolon için üst/alt/sol/sağ boşluk.
- **Genişlik** — 12'lik grid sisteminde boyutlandırma.
- **Görünürlük** — Kolonları modalda gizle/göster.
- **Yeniden boyutlandırma** — Modal yüksekliğini sürükleyerek ayarlama.
- **Canlı önizleme** — "Önizleme" ↔ "Modalı Göster" geçişi.
- **Sıfırlama** — Geri alma ve tamamen sıfırlama.

**Modal Boyutları:** `Sm` · `Md` · `Lg` · `Full` (tam ekran) · `Blank` (yeni sekmede tam sayfa) · `Overlay` (sayfa üstü tam ekran).

---

## 🏢 Multi-Tenant & White-Label

WorkGrid baştan sona **çok kiracılı (multi-tenant)** ve **beyaz etiketli (white-label)** olarak tasarlanmıştır.

- **Çoklu Kiracılık:** Yüzlerce farklı müşteri, aynı sistem üzerinde ama tamamen izole, kendi çalışma alanlarıyla.
- **White-Label:** Her kiracı kendi markasını yaşar — navbar stili, logo konumu, primary/secondary kurumsal renkler, hücre seviyesine kadar inline CSS.
- **Feature Flag Sistemi (FeatureGuard):** Modüller kiracı bazında açılıp kapatılır — `showCrm`, `showECommerce`, `showCalendar`, `showChat`, `showTask`, `showLanding`, `showBlog`. Bir müşteri sadece e-ticaret görür, diğeri sadece CRM.
- **TenantConfig:** Kiracıya özel tüm ayarlar, tema ve marka bilgisi merkezi olarak yönetilir.

> Sitedeki hiçbir içerik statik değildir — About, FAQ, Gallery, menü öğeleri, landing dahil her şey veritabanından dinamik gelir ve kiracıya göre değişir.

---

## 🏗️ Mimari

WorkGrid, **Clean Architecture**, **Domain-Driven Design (DDD)**, **CQRS** ve **SOLID** prensipleri üzerine kuruludur.

```
┌──────────────────────────────────────────────────────────────┐
│                   workgrid.Web (React + TS)                   │
│   Component Factory · 40+ input · Modal editör · Modüller     │
└───────────────────────────────┬──────────────────────────────┘
                                │ REST / JWT / WebSocket (SignalR)
┌───────────────────────────────▼──────────────────────────────┐
│                    workgrid.WebApi (.NET)                     │
│      Controller'lar · JWT Auth · Middleware · Swagger         │
└───────────────────────────────┬──────────────────────────────┘
                                │ MediatR
┌───────────────────────────────▼──────────────────────────────┐
│                 workgrid.Application (CQRS)                   │
│  Commands · Queries · Handlers · Pipeline Behaviors           │
│  Domain Event Handlers · Validation · Result Pattern          │
└───────────────────────────────┬──────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────┐
│                      workgrid.Domain                         │
│   Rich Domain Entities · Domain Events · Value Objects        │
│   Smart Enums · İş Kuralları   (dış bağımlılık yok)           │
└───────────────────────────────┬──────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────┐
│                  workgrid.Infrastructure                     │
│  EF Core · Repository · Unit of Work · Interceptors          │
│  Redis · RabbitMQ · MongoDB · Outbox                         │
└──────────────────────────────────────────────────────────────┘

     ┌──────────────────────────┐   ┌──────────────────────────┐
     │   workgrid.FileApi       │   │   LoggingApi (MongoDB)   │
     │  Dosya yükleme/indirme   │   │   NoSQL audit / log      │
     └──────────────────────────┘   └──────────────────────────┘
```

### Katmanlar
| Katman | Sorumluluk | Bağımlılık |
|--------|-----------|------------|
| `workgrid.Domain` | Rich Domain entity'leri, domain event'leri, value object'ler, smart enum'lar, iş kuralları | Yok |
| `workgrid.Application` | CQRS handler'ları, pipeline behavior'lar, validation, event handler'ları | → Domain |
| `workgrid.DTO` | Katmanlar arası veri transfer nesneleri | → Domain |
| `workgrid.Infrastructure` | EF Core, Repository, UnitOfWork, Redis, RabbitMQ, MongoDB, interceptors | → Application, Domain |
| `workgrid.WebApi` | REST controller'ları, JWT, middleware, DI | → Application, Infrastructure |
| `workgrid.FileApi` | Bağımsız dosya servisi | — |
| `workgrid.Web` | React kullanıcı arayüzü | REST / WebSocket |

---

## ⚙️ Backend Derinlemesine

### Domain-Driven Design — Rich Domain Model
İş kuralları handler'larda değil, **doğrudan entity'lerin kalbinde** yaşar. Entity'ler "anemic" (sadece veri tutan torbalar) değil, kendi kararlarını veren akıllı nesnelerdir.

```csharp
public class Datatable : BaseAuditableEntity<long>
{
    public string Name { get; private set; } = null!;   // private set: dışarıdan rastgele değişemez
    public TableStatus Status { get; private set; }

    public void Archive()        // "Status = 2" değil, table.Archive()
    {
        if (Status == TableStatus.Archived) return;
        Status = TableStatus.Archived;
        AddDomainEvent(new TableArchivedEvent(this));
    }

    public void AddColumn(string name, DataType type)
    {
        if (_columns.Any(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
            throw new DomainException($"{name} adında bir kolon zaten mevcut.");
        _columns.Add(new TableColumn(name, type));
    }
}
```

Bu yaklaşımın getirileri:
- **Encapsulation:** `private set` ile veri yalnızca tanımlı metotlarla (`Archive`, `Rename`...) değişir.
- **Ubiquitous Language:** Kod, iş diliyle konuşur — `table.Archive()` insan gibi okunur.
- **Value Objects:** İlkel tip takıntısından (Primitive Obsession) kaçınmak için `ColumnName` gibi değer nesneleri; doğrulama nesnenin içinde.
- **Smart Enums:** `TableViewType` gibi davranış taşıyan enum'lar (ikon, maksimum satır gibi metadata ile).
- **Bounded Context:** Table / Identity / Notification bağlamları birbirinden ayrı; yalnızca domain event'lerle haberleşir.

### CQRS + MediatR
Okuma (Query) ve yazma (Command) sorumlulukları kesin ayrılır. **Pipeline Behaviors** ile cross-cutting concern'ler (cache invalidation, validation, loglama) merkezileştirilir — controller'a yazmak yerine MediatR boru hattında araya girilir.

### Repository + Unit of Work
Veri erişimi repository'lerle soyutlanır. İlişkili dinamik hücreler ve cascade silme işlemleri **tek bir transaction** içinde gerçekleşir; yarıda kesilirse veri çöpü oluşmaz.

### Domain Events & Event-Driven Cache
Cache tutarlılığı handler içinde değil, **domain event handler'larında** sağlanır. Örnek: bir hücre oluşturulunca `TableCellCreatedEvent` tetiklenir; `CreatedTableCellCacheEventHandler` ilgili Redis anahtarlarını temizler.

### Outbox Pattern
Dış dünyaya (Redis, RabbitMQ, e-posta) gönderilecek işler, doğrudan tetiklenmek yerine veritabanında bir Outbox tablosuna "yapılacak iş" olarak yazılır. Ana veri ve outbox mesajı **tek atomik transaction** ile kaydedilir — ya ikisi de yazılır ya hiçbiri. Bu, "veritabanı güncellendi ama yan işlem (cache/mail) yapılamadı" tutarsızlığını ortadan kaldırır.

### Diğer desenler
- **Result Pattern** — Hata yönetimi exception fırlatmak yerine `Result<T>` ile.
- **FluentValidation** — İstek doğrulama, pipeline'a entegre.
- **Global Exception Handling / Middleware** — Merkezi hata yakalama.
- **Interceptors / AOP** — Loglama, audit, performans ölçümü iş mantığını kirletmeden.
- **Redis** — Sık erişilen, nadiren değişen veriler (tema, ayarlar, lookup) için in-memory cache.
- **RabbitMQ** — Event-driven mesajlaşma ve arka plan görevleri (background jobs).
- **MongoDB (LoggingApi)** — NoSQL tabanlı denetim (audit) ve loglama.
- **SignalR / WebSocket** — Gerçek zamanlı, canlı hücre güncellemeleri.

---

## 💻 Frontend Derinlemesine

Frontend, projenin en çok emek verilen kısmıdır — son kullanıcının platformla tek temas noktası burasıdır ve en ufak takılma kabul edilmez.

### Dinamik Component Factory (Render Motoru)
GridBase'den gelen kolon tipine göre, **çalışma zamanında** hangi React bileşeninin (DatePicker, NumberInput, Select, FileManager...) render edileceğine karar veren bir motor. Yeni bir kolon tipi, sisteme yeni bir UI ekler — koda dokunmadan.

```
TableColumn.type (InputTypeEnum)
        │
        ├─ Düzenleme modu → INPUT_COMPONENT_MAP[type] → <XxxInput />
        │
        └─ Liste/görüntüleme → CELL_COMPONENT_MAP[type] → <XxxCell />
```

### Metadata-Driven Yapı
Input davranışı (maxSize, format, readonly, hidden, required) koda gömülü değildir; `AttributeEnum` ve `PropertyEnum` katmanlarıyla **dışarıdan beslenir**. Veritabanına yeni bir kural eklemek, tüm sistemde yeni bir davranış yayına almak demektir.

### Context-Aware UI
Aynı bileşen bağlama göre farklı davranır: **EditRow**, **Modal**, **View**, **Table Cell** modlarında farklı render ve etkileşim.

### Durum Yönetimi & Veri
- **TanStack Query (React Query):** Tüm sunucu durumu — tablolar, satırlar, hücreler, kullanıcılar. Otomatik cache, invalidation, stale-while-revalidate.
- **Custom hook katmanı:** `useGridbaseAll / Paged / ById / Create / Update / Patch / Delete`.
- **Formik + Yup:** Form durumu + çalışma zamanında üretilen dinamik doğrulama şeması (`createDynamicYupSchema`).
- **Context mimarisi:** `DatatableContext` / `DatatableItemContext` ile prop-drilling minimize.

### Performans
**Hücre bazlı memoization** (`MemoizedCell`) ile yalnızca değişen hücre yeniden render olur; tablo binlerce hücre içerse bile bir hücre güncellendiğinde tüm tablo yeniden çizilmez.

### Etkileşim & Tip Güvenliği
- **Drag & Drop ekosistemi** — Kolon/satır sıralama, modal tasarım yerleşimi, nestable list.
- **%100 TypeScript** — `any`'den kaçınma; DTO ile frontend pürüzsüz konuşur.

### Zengin Bileşen Entegrasyonu
Ant Design (date picker, upload, rating, QR), CKEditor 5, Monaco Editor, Reactstrap/Bootstrap, SimpleBar, Swiper, Remix Icon — birbirinden farklı kütüphaneler tek bir "orkestra şefi" altında uyumla çalışır. **Day.js** ISO Week, Quarter ve custom range plugin'leriyle gelişmiş tarih/zaman yönetimi sağlar.

---

## 🔐 Güvenlik & Yetkilendirme

- **JWT** tabanlı kimlik doğrulama (giriş/çıkış).
- **Rol bazlı erişim** — `WG`, `Admin`, `User` rolleri. Route koruması: personel rolleri (WG/Admin/User), admin rolleri (WG/Admin), süper-admin (WG).
- **FeatureGuard** — Hem role hem feature flag'e göre sayfa/komponent koruması.
- **Tablo bazlı erişim** — AccessLevel ile satır/tablo seviyesinde yetki, owner süzme, admin bypass.
- Hassas yapılandırma (`.env`, `appsettings`) sürüm kontrolüne dahil edilmez.

---

## 📦 Modüller — Detaylı

Tüm modüller backend'e bağlı, gerçek veriyle çalışır ve FeatureGuard ile kiracı bazında açılıp kapatılabilir.

### 🏠 Dinamik Landing
Tek sayfa (one-page) tanıtım/karşılama ekranı. İçeriği statik değildir — kiracının ayarlarına göre dinamik gelir. `showLanding` feature flag'iyle yönetilir.

### 📊 Dashboard
Genel bakış ve özet ekranı. Sisteme giriş sonrası ana karşılama paneli.

### 🗂️ GridBase / Datatables (Çekirdek)
Platformun kalbi. Dinamik tabloların oluşturulduğu, kolonların ve ilişkilerin tanımlandığı, satırların düzenlendiği modül.
- **Sayfalar:** Tablo listesi (`/datatables`), tablo detayı/satırlar (`/datatable/:id`), dinamik kayıt ekle-görüntüle-düzenle (`/datatable-view/:id`).
- **Yetenekler:** Kolon ayarları, Relations tab (ilişkiler), validation/property tanımları, modal tasarım editörü, EditRow.
- **Erişim:** Personel rolleri, `showCrm`.

### 🛒 E-Ticaret
Uçtan uca, çalışan bir e-ticaret modülü.
- **Mağaza & Ürünler:** Mağaza ana sayfası (`/store`), ürün listesi (`/products`), ürün detayı (`/product-detail/:id`), ürün ekle/düzenle (`/add-product`, `/edit-product/:id`).
- **Sepet & Ödeme:** Sepet (`/cart`), ödeme (`/checkout`), istek listesi (`/wishlist`).
- **Siparişler:** Kullanıcı siparişleri (`/orders`), admin sipariş yönetimi (`/admin-orders`), sipariş detayı (`/order-details/:id`), fatura (`/invoice-details/:id`).
- **Yönetim:** Müşteriler (`/customers`), kuponlar (`/coupons`), ürün yorumları paneli.
- **Erişim:** Vitrin herkese açık; yönetim admin rolleri, `showECommerce`.

### 📝 Blog
- **Sayfalar:** Blog listesi (`/blog-list`), blog detayı (`/blog-detail/:id`), oluştur/düzenle (`/blog-create`, `/blog-edit/:id`), yorum paneli.
- **Erişim:** Okuma herkese açık (`showBlog`); yazı yönetimi admin rolleri.

### ✅ Görevler / Task (Kanban)
Proje ve görev yönetimi.
- **Sayfalar:** Projeler (`/projects`), Kanban panosu (`/kanbanboard`), görev detayı (`/taskDetails/:id`), yapılacaklar listesi (`/toDoList`).
- **Erişim:** Personel rolleri, `showTask`.

### 📅 Takvim / Calendar
Etkinlik ve tarih yönetimi (`/calendar`). Personel rolleri, `showCalendar`.

### 💬 Sohbet / Chat
Mesajlaşma modülü (`/chat`). Personel rolleri, `showChat`.

### 💭 Yorumlar / Comments
Blog ve ürünlere bağlanabilen ortak yorum sistemi (`/comment-panel-blog/:id`, `/comment-panel-product/:id`). İçeriğe (Blog / Product) göre çalışan tek panel.

### ⚙️ Ayarlar / Settings (Tenant)
Kiracı ayarları, tema, marka, feature flag yönetimi (`/settings`). Yalnızca süper-admin (WG).

### 👤 Kimlik / Auth & Profil
Giriş, kayıt, şifre sıfırlama, kullanıcı profili. Profil sayfaları (`/user-profile`, `/profile/:id`, `/profile-settings`), şifre işlemleri, 2 adımlı doğrulama, kilit ekranı ve hata sayfaları (403/404/500/offline).

### 🧭 Menü Yönetimi
Dinamik menü öğeleri yönetimi (`/menuItems`). Admin rolleri. Menü statik değildir, yönetilebilir.

### 👥 Kullanıcı & Rol Yönetimi
Kullanıcı yönetimi (`/users`) ve rol yönetimi (`/roles`). Admin rolleri.

### 📄 Statik Olmayan İçerik Sayfaları
Hiçbiri sabit kodlu değildir — hepsi dinamik içerik:
- **Hakkımızda** (`/about`), **SSS / FAQ** (`/faqs`), **Galeri** (`/gallery`), **İletişim** (`/contacts`), **Gizlilik** (`/privacy-policy`), **Şartlar** (`/terms-condition`).

### 🗃️ Diğer
**Takım** (`/team`), **Dökümanlar** (`/documents`), **WorkGrid tanıtım** (`/workgrid`), **Arama sonuçları** (`/search-results`).

---

## 🧰 Teknoloji Yığını

### Backend
| Teknoloji | Kullanım |
|-----------|----------|
| **.NET / ASP.NET Core** | Web API |
| **Entity Framework Core** | ORM, migration, repository |
| **MediatR** | CQRS, pipeline behaviors |
| **CQRS + Clean Architecture + DDD** | Mimari temel |
| **FluentValidation** | İstek doğrulama |
| **Redis** | In-memory cache |
| **RabbitMQ** | Mesajlaşma, background jobs |
| **MongoDB** | NoSQL audit/log (LoggingApi) |
| **SignalR** | Gerçek zamanlı iletişim |
| **JWT** | Kimlik doğrulama |
| **Swagger / OpenAPI** | API dokümantasyonu |

### Frontend
| Teknoloji | Kullanım |
|-----------|----------|
| **React + TypeScript** | UI çatısı (%100 tip güvenli) |
| **TanStack Query** | Sunucu durumu yönetimi |
| **Formik + Yup** | Form ve dinamik doğrulama |
| **Reactstrap / Bootstrap** | UI bileşenleri |
| **Ant Design** | Date picker, upload, rating, QR |
| **CKEditor 5** | Zengin metin editörü |
| **Monaco Editor** | Kod editörü |
| **Day.js** | Gelişmiş tarih/zaman |
| **SimpleBar / Swiper / Remix Icon** | Scroll, galeri, ikonlar |

---

## 🚀 Kurulum

> **Not:** Bu, WorkGrid'in ilk prototip sürümüdür. Adımlar yapılandırmanıza göre değişebilir.

### Gereksinimler
- [.NET SDK](https://dotnet.microsoft.com/download) (8.0+ önerilir)
- [Node.js](https://nodejs.org/) (18+ önerilir)
- [Redis](https://redis.io/), [RabbitMQ](https://www.rabbitmq.com/), [MongoDB](https://www.mongodb.com/)
- Veritabanı (yapılandırmaya göre)

### 1. Depoyu klonlayın
```bash
git clone https://github.com/aysenuraydin/workgrid-startup.git
cd workgrid-startup
```

### 2. Backend (Ana API)
```bash
cd src/workgrid.WebApi
# appsettings.json: veritabanı, Redis, RabbitMQ, MongoDB bağlantılarını ayarlayın
dotnet restore
dotnet ef database update
dotnet run
```

### 3. Dosya API'si
```bash
cd src/workgrid.FileApi
dotnet run
```

### 4. Frontend
```bash
cd src/workgrid.Web
# .env: API adreslerini ayarlayın
npm install
npm start
```
Uygulama `http://localhost:3000` adresinde açılır.

---

## 📂 Proje Yapısı

```
workgrid-startup/
├── src/
│   ├── workgrid.Domain/          # Rich domain entity'leri, event'ler, value objects
│   ├── workgrid.Application/     # CQRS, pipeline behaviors, validation
│   │   └── Features/
│   ├── workgrid.DTO/             # DTO'lar
│   ├── workgrid.Infrastructure/  # EF Core, Redis, RabbitMQ, MongoDB, repository
│   ├── workgrid.WebApi/          # REST API, controller'lar, middleware
│   ├── workgrid.FileApi/         # Dosya servisi
│   └── workgrid.Web/             # React frontend
│       └── src/
│           ├── pages/            # Crm, Ecommerce, Blog, Tasks, Calendar, Chat...
│           │   └── Crm/DatatableItem/
│           │       ├── RenderCellInput/components/   # 40+ input
│           │       └── ListItem/components/          # liste hücreleri
│           ├── hooks/            # TanStack Query hook'ları
│           ├── common/
│           │   ├── enums/        # InputTypeEnum, AttributeEnum, PropertyEnum
│           │   └── map/          # INPUT/CELL_COMPONENT_MAP
│           └── helpers/          # validationHelper, backend_helper
└── workgrid.sln
```

---

## 🧑‍💻 Geliştirici Rehberi: Yeni Input Tipi Ekleme

Yeni bir hücre tipi eklemek standart bir pipeline izler (örnek: **Switch**):

1. **Enum'a ekle** — `InputTypeEnum` (frontend + backend).
2. **Input bileşeni** — `RenderCellInput/components/SwitchInput.tsx` (düzenleme modu).
3. **Kaydet** — `INPUT_COMPONENT_MAP`.
4. **Cell bileşeni** — `ListItem/components/SwitchCell.tsx` (liste/görüntüleme).
5. **Kaydet** — `CELL_COMPONENT_MAP`.
6. **Ayar map'leri** — `INPUT_DATA_MAP` + `INPUT_UI_MAP` (zorunlu; `Record` tipi derleme zamanında dayatır).

> Tip güvenliği sayesinde eksik bir adım derleme zamanında yakalanır. İlişkili tip eklerken (Parent gibi), liste tarafında `realTableId` dolu kolonların yanlışlıkla Foreign Column olarak işlenmemesine dikkat edin.

---

## 🔮 Yol Haritası — Yakında Gelecekler

WorkGrid aktif geliştirme aşamasındadır. Planlanan özellikler:

### Yapay Zeka & Görsel Zeka
- **🤖 AI Entegrasyonu** — "Konuşarak tablo/sayfa oluştur" (Natural Language → UI/DB). Ne istediğinizi anlatın, sistem sizin yerinize tabloları kursun, siteyi hazırlasın.
- **📷 OpenCV Entegrasyonu** — Fatura/belge fotoğrafını tarayıp otomatik olarak tablo + kolon + hücre oluşturma. Manuel veri girişini ~%90 azaltma.

### Platform & UX
- **🧩 Dinamik Dashboard** — Kullanıcının kendi ekleyebildiği widget'lar.
- **📌 Yapışkan Notlar** — Ana ekranda hatırlatma notları.
- **🎨 Kullanıcının Kendi Sayfa Tasarımı** — Şu an tema ayarlanabiliyor; gelecekte kullanıcı kendi route'unu açıp sayfayı sıfırdan tasarlayabilecek.
- **📱 Çoklu Platform Export** — Web'in yanında mobil uygulama, masaüstü ve tablet sürümleri.
- **🧭 Tour / Onboarding** — Yeni kullanıcılara sistemi adım adım tanıtan interaktif gezinti.
- **🌍 i18n / Çoklu Dil** — `tr.json`, `en.json` ile çok dilli arayüz.

### Veri & İş Mantığı
- **✅ Validation'ın CRUD'a Tam Bağlanması** — Doğrulama altyapısı hazır; GridBase create/update akışına tam entegrasyonu.
- **🔢 Tablo Bazlı Function** — Kolon fonksiyonları var; tablo geneli hesaplama (örn. tüm siparişlerin toplamı) ve tablolar arası veri hesabı.
- **🔗 Foreign Key Doğrulama** — Var olmayan id'lerin reddedilmesi (öksüz kayıt engelleme).
- **➕ Foreign Add Butonu / İç İçe Satır** — İlişkili tabloya satırı yerinde ekleme, iç içe satır input'ları.
- **🔄 Transaction / Atomik İşlem** — Sipariş + stok gibi işlemlerin tek bütün olarak yürütülmesi.
- **🔎 Gelişmiş Arama** — Full-text arama, gelişmiş tarih filtresi.
- **📥 Excel Import** — Excel'den toplu veri içe aktarma.

### Güvenlik & Ticarileşme
- **🔐 Rate Limiting + Refresh Token** — API güvenliği ve oturum yenileme.
- **🔑 Remember Me** — Giriş bilgilerini güvenli hatırlama.
- **🔤 Route Slug** — URL'lerde sayı yerine okunabilir metin.
- **💳 Para Kazanma** — Freemium kademe limitleri, ücretsiz sürüm için reklam alanları.
- **📧 Mail / SMS Sender** — Hesap onaylama ve bildirimler.

### 🌌 Uzak Vizyon
Anomali tespiti (akıllı bekçi — anormal değerleri uyarma), sesli komut (hands-free veri girişi), dinamik export sihirbazı (AI ile PDF/dilekçe üretip mail atma), offline-first mobil (internetsiz çalışıp senkronize olma), App Store / Google Play / masaüstü dağıtımı.

---

## ❓ Sık Sorulan Sorular

**WorkGrid bir veritabanı mı?**
Hayır. WorkGrid, ilişkisel bir veritabanının (EF Core üzerinden) üstünde çalışan, kullanıcıların dinamik tablolar tanımlamasını sağlayan bir platformdur.

**GridBase nedir, WorkGrid'den farkı ne?**
GridBase, WorkGrid'in çekirdeğindeki self-hosted BaaS motorudur — Firebase/Supabase muadili. Tablo/satır/hücre/ilişki kavramlarını yönetir ama hiçbir iş alanını bilmez. WorkGrid onu kullanarak e-ticaret, blog gibi gerçek ürünler inşa eder. GridBase ileride bağımsız bir ürün olarak sunulabilir.

**Gerçekten kod yazmadan her şey yapılabilir mi?**
Tablo tasarımı, ilişkiler, doğrulama, hesaplama kolonları, modal düzeni ve 40+ veri tipi koda dokunmadan yönetilir. Çok özel iş mantığı için geliştirici müdahalesi gerekebilir.

**Multi-tenant nasıl çalışıyor?**
Yüzlerce müşteri aynı sistemde izole çalışır; her biri kendi teması, logosu, renkleri ve açık modülleriyle (FeatureGuard) kendi markasını yaşar.

**Veriler nasıl saklanıyor?**
GridBase arka planda EAV (satır/hücre) modeli kullanır ama dışarıya temiz JSON sunar. Esneklik ile geliştirici dostu API'yi birleştirir.

---

<div align="center">

### 🟦 WorkGrid & GridBase

**Veriyi siz şekillendirin.**

*No-Code · PaaS + BaaS · Multi-Tenant · Clean Architecture · DDD · CQRS · 40+ Input Tipi*

İlk prototip sürümü

</div>
