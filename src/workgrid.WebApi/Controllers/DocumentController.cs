using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.API.Controllers;

[ApiController]
[Authorize(Roles = "WG")]
[Route("api/[controller]")]
public class DocumentController(IDocumentService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<DocumentDto>> Get() =>
        Ok(await service.GetAsync());

    [HttpPut]
    public async Task<ActionResult<DocumentDto>> Upsert(DocumentDto dto) =>
        Ok(await service.UpsertAsync(dto));
}


// <!DOCTYPE html>
// <html lang="tr">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>WorkGrid &amp; GridBase — Motor Dokümantasyonu</title>
// <style>
//   :root{
//     --bg:#ffffff;--panel:#f7f8fa;--panel-2:#eef1f5;--line:#e3e7ee;
//     --ink:#1a1f2b;--ink-soft:#4a5468;--ink-mute:#8a93a6;
//     --accent:#3b6fed;--accent-bg:#eaf0fe;
//     --primary:#3b6fed;--primary-bg:#eaf0fe;
//     --success:#1a9d57;--success-bg:#e6f5ec;
//     --warning:#b5790a;--warning-bg:#fbf2dd;
//     --danger:#d23b2e;--danger-bg:#fbe9e7;
//     --info:#0e8fb8;--info-bg:#e2f4fa;
//     --secondary:#6b46c8;--secondary-bg:#efe9fb;
//     --dark:#2d3340;--dark-bg:#e9ecf1;
//     --code-bg:#f6f8fa;--mark:#eef1f5;
//     --radius:10px;--maxw:920px;
//     --mono:"SF Mono","JetBrains Mono",Menlo,Consolas,monospace;
//     --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
//   }
//   *{box-sizing:border-box;margin:0;padding:0}
//   html{scroll-behavior:smooth}
//   body{background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.65;-webkit-font-smoothing:antialiased}
//   a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
//   code{font-family:var(--mono);font-size:.88em}

//   .wrap{display:grid;grid-template-columns:300px 1fr;min-height:100vh}

//   /* SIDEBAR */
//   .side{position:sticky;top:0;height:100vh;overflow-y:auto;background:var(--panel);border-right:1px solid var(--line);padding:26px 16px 60px}
//   .side::-webkit-scrollbar{width:8px}.side::-webkit-scrollbar-thumb{background:var(--line);border-radius:4px}
//   .brand{display:flex;align-items:center;gap:11px;padding:0 8px 20px;margin-bottom:12px;border-bottom:1px solid var(--line)}
//   .brand .logo{width:38px;height:38px;border-radius:10px;flex:none;background:linear-gradient(135deg,#3b6fed,#6b46c8);display:grid;place-items:center;font-weight:800;color:#fff;font-size:17px;box-shadow:0 2px 8px rgba(59,111,237,.3)}
//   .brand .name{font-weight:700;font-size:15.5px;letter-spacing:-.2px}
//   .brand .sub{font-size:11px;color:var(--ink-mute);margin-top:1px}
//   .nav-group{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-mute);padding:14px 11px 5px}
//   .nav a{display:flex;align-items:center;gap:9px;padding:7px 11px;border-radius:8px;color:var(--ink-soft);font-size:13.5px;line-height:1.3;transition:background .12s,color .12s;margin-bottom:1px}
//   .nav a:hover{background:var(--panel-2);color:var(--ink);text-decoration:none}
//   .nav a.active{background:var(--accent-bg);color:var(--accent);font-weight:600}
//   .nav a i{font-size:16px;width:18px;text-align:center;flex:none}
//   .nav .num{font-size:11px;color:var(--ink-mute);font-weight:600;min-width:18px}
//   .nav a.active .num{color:var(--accent)}

//   /* CONTENT */
//   .main{padding:0 0 120px}
//   .content{max-width:var(--maxw);margin:0 auto;padding:0 40px}

//   /* HERO */
//   .hero{background:linear-gradient(135deg,#3b6fed,#6b46c8);border-radius:0 0 20px 20px;padding:50px 40px 42px;text-align:center;color:#fff;margin-bottom:40px}
//   .hero h1{font-size:31px;font-weight:800;letter-spacing:-.5px;color:#fff;margin-bottom:8px}
//   .hero p{color:rgba(255,255,255,.88);font-size:15px;margin:0 0 16px}
//   .hero .tags{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-bottom:14px}
//   .hero .tags span{background:rgba(255,255,255,.16);color:#fff;font-size:11.5px;font-weight:600;padding:4px 11px;border-radius:20px}
//   .hero .upd{display:inline-block;background:rgba(255,255,255,.22);color:#fff;font-size:12px;font-weight:600;padding:4px 14px;border-radius:20px}

//   section{scroll-margin-top:24px;padding:34px 0}
//   section + section{border-top:1px solid var(--line)}
//   .sec-head{display:flex;align-items:center;gap:12px;margin-bottom:18px}
//   .sec-head .sec-ico{width:42px;height:42px;border-radius:11px;flex:none;display:grid;place-items:center;font-size:21px}
//   .sec-head h2{font-size:23px;font-weight:750;letter-spacing:-.4px}
//   h3{font-size:16.5px;font-weight:700;margin:26px 0 12px;color:var(--ink);display:flex;align-items:center;gap:8px}
//   h3 i{font-size:17px}
//   h4{font-size:14.5px;font-weight:700;margin:18px 0 8px;color:var(--ink-soft)}
//   p{margin:11px 0;color:var(--ink-soft)}
//   p.lead{font-size:16.5px;color:var(--ink-soft);line-height:1.6}
//   p strong,li strong{color:var(--ink);font-weight:650}
//   ul,ol{margin:11px 0 11px 4px;padding-left:22px;color:var(--ink-soft)}
//   li{margin:6px 0}

//   /* COLOR HELPERS */
//   .c-primary{color:var(--primary)}.c-success{color:var(--success)}.c-warning{color:var(--warning)}
//   .c-danger{color:var(--danger)}.c-info{color:var(--info)}.c-secondary{color:var(--secondary)}.c-dark{color:var(--dark)}
//   .bg-ico-primary{background:var(--primary-bg);color:var(--primary)}
//   .bg-ico-success{background:var(--success-bg);color:var(--success)}
//   .bg-ico-warning{background:var(--warning-bg);color:var(--warning)}
//   .bg-ico-danger{background:var(--danger-bg);color:var(--danger)}
//   .bg-ico-info{background:var(--info-bg);color:var(--info)}
//   .bg-ico-secondary{background:var(--secondary-bg);color:var(--secondary)}
//   .bg-ico-dark{background:var(--dark-bg);color:var(--dark)}

//   /* BADGE */
//   .badge{display:inline-block;font-size:11.5px;font-weight:650;padding:3px 9px;border-radius:6px;line-height:1.4;white-space:nowrap}
//   .badge.primary{background:var(--primary-bg);color:var(--primary)}
//   .badge.success{background:var(--success-bg);color:var(--success)}
//   .badge.warning{background:var(--warning-bg);color:var(--warning)}
//   .badge.danger{background:var(--danger-bg);color:var(--danger)}
//   .badge.info{background:var(--info-bg);color:var(--info)}
//   .badge.secondary{background:var(--secondary-bg);color:var(--secondary)}
//   .badge.dark{background:var(--dark-bg);color:var(--dark)}

//   /* INFO CARD */
//   .grid{display:grid;gap:14px;margin:16px 0}
//   .grid.c2{grid-template-columns:1fr 1fr}
//   .grid.c3{grid-template-columns:1fr 1fr 1fr}
//   .grid.c4{grid-template-columns:repeat(4,1fr)}
//   @media(max-width:760px){.grid.c2,.grid.c3,.grid.c4{grid-template-columns:1fr}}
//   .icard{border-left:3px solid var(--primary);background:var(--primary-bg);border-radius:0 9px 9px 0;padding:13px 15px}
//   .icard.primary{border-left-color:var(--primary);background:var(--primary-bg)}
//   .icard.success{border-left-color:var(--success);background:var(--success-bg)}
//   .icard.warning{border-left-color:var(--warning);background:var(--warning-bg)}
//   .icard.danger{border-left-color:var(--danger);background:var(--danger-bg)}
//   .icard.info{border-left-color:var(--info);background:var(--info-bg)}
//   .icard.secondary{border-left-color:var(--secondary);background:var(--secondary-bg)}
//   .icard h6{font-size:13.5px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:7px}
//   .icard.primary h6{color:var(--primary)}.icard.success h6{color:var(--success)}
//   .icard.warning h6{color:var(--warning)}.icard.danger h6{color:var(--danger)}
//   .icard.info h6{color:var(--info)}.icard.secondary h6{color:var(--secondary)}
//   .icard p{margin:0;font-size:13px;color:var(--ink-soft);line-height:1.5}

//   /* FEATURE CARD */
//   .fcard{text-align:center;border:1px solid var(--line);border-radius:12px;padding:20px 14px;background:var(--bg)}
//   .fcard .fico{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-size:23px;margin:0 auto 12px}
//   .fcard h6{font-size:14px;font-weight:700;margin-bottom:4px}
//   .fcard p{font-size:12.5px;color:var(--ink-mute);margin:0;line-height:1.5}

//   /* TABLE */
//   .tbl{width:100%;border-collapse:collapse;margin:16px 0;font-size:13.5px;border-radius:var(--radius);border:1px solid var(--line);overflow:hidden}
//   .tbl th{background:var(--dark);color:#fff;text-align:left;padding:10px 13px;font-weight:600;font-size:12.5px}
//   .tbl td{padding:9px 13px;border-bottom:1px solid var(--line);color:var(--ink-soft);vertical-align:top}
//   .tbl tr:last-child td{border-bottom:none}
//   .tbl tbody tr:hover td{background:rgba(0,0,0,.012)}
//   .tbl code{white-space:nowrap;background:var(--mark);padding:1.5px 6px;border-radius:5px;color:#34405a;font-size:.88em;border:1px solid var(--line)}

//   /* CALLOUT */
//   .alert{border-radius:9px;padding:13px 16px;margin:16px 0;font-size:14px;display:flex;gap:10px;align-items:flex-start}
//   .alert i{font-size:18px;flex:none;margin-top:1px}
//   .alert.info{background:var(--info-bg);color:#0a6a8a}
//   .alert.success{background:var(--success-bg);color:#147544}
//   .alert.warning{background:var(--warning-bg);color:#8a5c08}
//   .alert.danger{background:var(--danger-bg);color:#a32d22}
//   .alert strong{color:inherit}

//   /* STEP LIST */
//   .steps{display:flex;flex-direction:column;gap:8px;margin:14px 0}
//   .step{display:flex;gap:13px;align-items:flex-start;padding:10px 13px;background:var(--panel);border-radius:9px}
//   .step .n{width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:700;font-size:12.5px;background:var(--accent-bg);color:var(--accent)}
//   .step p{margin:2px 0 0;font-size:13.5px}

//   /* FUNC EXAMPLE */
//   .func{display:flex;gap:9px;align-items:flex-start;padding:7px 11px;background:var(--bg);border:1px solid var(--line);border-radius:7px;margin-bottom:7px}
//   .func code{color:var(--success);font-weight:600;white-space:nowrap;font-size:12.5px}
//   .func span{color:var(--ink-mute);font-size:12.5px}

//   /* CODE BLOCK */
//   pre{background:var(--code-bg);border:1px solid var(--line);border-radius:10px;padding:16px 18px;overflow-x:auto;margin:14px 0;font-family:var(--mono);font-size:12.5px;line-height:1.6;color:#2d3748}
//   pre code{font-size:inherit;color:inherit}
//   .arch{font-size:11.5px;line-height:1.5;white-space:pre}

//   /* INLINE CODE */
//   p code,li code,.icard code{background:var(--mark);padding:1.5px 6px;border-radius:5px;color:#34405a;font-size:.86em;border:1px solid var(--line)}
//   .codechip{display:inline-block;background:var(--panel-2);border:1px solid var(--line);border-radius:6px;padding:3px 8px;font-family:var(--mono);font-size:12px;color:#34405a;margin:2px 0}

//   /* CHIPS */
//   .chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
//   .techbox{background:var(--accent-bg);border-radius:11px;padding:18px 20px;margin:18px 0}
//   .techbox h6{color:var(--primary);font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:7px}

//   /* LAYER STACK */
//   .layer{border:1px solid var(--line);border-left:4px solid var(--primary);border-radius:8px;padding:11px 15px;margin-bottom:8px;background:var(--bg)}
//   .layer .lt{font-weight:700;font-size:13.5px;color:var(--ink);font-family:var(--mono)}
//   .layer .ld{font-size:12.5px;color:var(--ink-mute);margin-top:2px}

//   /* MOBILE */
//   .menu-btn{display:none}
//   @media(max-width:880px){
//     .wrap{grid-template-columns:1fr}
//     .side{position:fixed;left:-320px;width:300px;z-index:50;transition:left .25s;box-shadow:4px 0 30px rgba(0,0,0,.15)}
//     .side.open{left:0}
//     .menu-btn{display:flex;position:fixed;top:14px;left:14px;z-index:60;width:42px;height:42px;background:var(--panel);border:1px solid var(--line);border-radius:9px;cursor:pointer;align-items:center;justify-content:center;color:var(--ink)}
//     .content{padding:0 20px}
//     .hero{border-radius:0;padding:60px 24px 32px}
//     .hero h1{font-size:24px}
//     .backdrop{position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:40;display:none}.backdrop.show{display:block}
//   }
// </style>
// </head>
// <body>

// <button class="menu-btn" id="menuBtn" aria-label="Menü">
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
// </button>
// <div class="backdrop" id="backdrop"></div>

// <div class="wrap">
//   <aside class="side" id="side">
//     <div class="brand">
//       <div class="logo">W</div>
//       <div><div class="name">WorkGrid &amp; GridBase</div><div class="sub">Motor Dokümantasyonu</div></div>
//     </div>
//     <nav class="nav">
//       <div class="nav-group">Temeller</div>
//       <a href="#overview"><span class="num">1</span><i class="ri-dashboard-3-line"></i>Genel Bakış</a>
//       <a href="#philosophy"><span class="num">2</span><i class="ri-compass-3-line"></i>Felsefe &amp; Kavramlar</a>
//       <a href="#gridbase"><span class="num">3</span><i class="ri-database-2-line"></i>GridBase (BaaS)</a>
//       <a href="#architecture"><span class="num">4</span><i class="ri-stack-line"></i>Mimari</a>
//       <div class="nav-group">Veri Motoru</div>
//       <a href="#tables"><span class="num">5</span><i class="ri-table-line"></i>Veri Tabloları</a>
//       <a href="#columns"><span class="num">6</span><i class="ri-list-settings-line"></i>Kolon &amp; Input Tipleri</a>
//       <a href="#relations"><span class="num">7</span><i class="ri-git-merge-line"></i>İlişkiler</a>
//       <a href="#rows"><span class="num">8</span><i class="ri-file-excel-2-line"></i>Satır Düzenle</a>
//       <a href="#validations"><span class="num">9</span><i class="ri-shield-check-line"></i>Doğrulama</a>
//       <a href="#options"><span class="num">10</span><i class="ri-settings-5-line"></i>Seçenekler</a>
//       <a href="#functions"><span class="num">11</span><i class="ri-functions"></i>Fonksiyonlar</a>
//       <a href="#designs"><span class="num">12</span><i class="ri-palette-line"></i>Tasarım (CSS/Class)</a>
//       <a href="#modals"><span class="num">13</span><i class="ri-window-line"></i>Modal Editörü</a>
//       <div class="nav-group">Platform</div>
//       <a href="#tenant"><span class="num">14</span><i class="ri-building-line"></i>Multi-Tenant</a>
//       <a href="#security"><span class="num">15</span><i class="ri-shield-user-line"></i>Güvenlik</a>
//       <a href="#modules"><span class="num">16</span><i class="ri-apps-2-line"></i>Modüller</a>
//       <a href="#stack"><span class="num">17</span><i class="ri-tools-line"></i>Teknoloji Yığını</a>
//       <a href="#roadmap"><span class="num">18</span><i class="ri-rocket-2-line"></i>Yol Haritası</a>
//     </nav>
//   </aside>

//   <main class="main">
//     <div class="hero">
//       <h1>WorkGrid &amp; GridBase</h1>
//       <p>No-Code / PaaS platformu ve self-hosted BaaS motoru — Kapsamlı Mimari ve Kullanım Kılavuzu</p>
//       <div class="tags">
//         <span>No-Code</span><span>PaaS + BaaS + SaaS</span><span>Multi-Tenant</span><span>White-Label</span><span>Clean Architecture</span><span>DDD</span><span>CQRS</span><span>40+ Input Tipi</span>
//       </div>
//       <span class="upd">İlk prototip sürümü · Güncel</span>
//     </div>
//     <div class="content" id="content">

//       <!-- 1. GENEL BAKIŞ -->
//       <section id="overview">
//         <div class="sec-head"><span class="sec-ico bg-ico-primary"><i class="ri-dashboard-3-line"></i></span><h2>1. Proje Genel Bakışı</h2></div>
//         <p class="lead"><strong>WorkGrid</strong>, işletmelerin kendi yazılım ekosistemlerini <strong>tek satır kod yazmadan</strong> dakikalar içinde inşa edebildiği yeni nesil bir <strong>No-Code / PaaS</strong> platformudur. Kalbinde, tamamen sıfırdan geliştirilmiş <strong>GridBase</strong> adlı bir <strong>BaaS</strong> motoru bulunur — Firebase veya Supabase muadili, ancak baştan sona kendi kontrolünüzde ve tamamen özelleştirilebilir.</p>
//         <p>Tablo oluşturun, kolonları sürükleyerek tasarlayın, tablolar arası ilişkiler kurun, doğrulama kuralları ve hesaplama formülleri tanımlayın, kayıt modallarını görsel olarak özelleştirin — hepsi çalışma zamanında, koda dokunmadan. Geleneksel "sabit şemalı" uygulamaların aksine, <strong>veri yapısını son kullanıcı tanımlar</strong>.</p>

//         <div class="grid c4">
//           <div class="fcard"><div class="fico bg-ico-primary"><i class="ri-database-2-line"></i></div><h6>Dinamik Şema</h6><p>SQL ve migration olmadan tablo, kolon ve ilişki tanımlayın.</p></div>
//           <div class="fcard"><div class="fico bg-ico-success"><i class="ri-shield-check-line"></i></div><h6>Çalışma Zamanı Doğrulama</h6><p>Kolon bazlı required, min/max, regex kuralları.</p></div>
//           <div class="fcard"><div class="fico bg-ico-warning"><i class="ri-git-merge-line"></i></div><h6>Gerçek İlişkiler</h6><p>1-N, N-N foreign column ve self-reference parent.</p></div>
//           <div class="fcard"><div class="fico bg-ico-info"><i class="ri-building-line"></i></div><h6>Multi-Tenant</h6><p>İzole kiracılar, white-label tema ve marka.</p></div>
//         </div>

//         <h3><i class="ri-stack-2-line c-primary"></i>Üç Katmanlı Değer</h3>
//         <table class="tbl">
//           <thead><tr><th style="width:26%">Katman</th><th>Ne Sunar</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge primary">GridBase (BaaS)</span></td><td>Dinamik şema, API, güvenlik ve ilişki motoru. Firebase/Supabase muadili, self-hosted.</td></tr>
//             <tr><td><span class="badge success">WorkGrid (PaaS)</span></td><td>Sürükle-bırak dinamik tablolar ve UI ile üzerinde yazılım inşa edilen platform.</td></tr>
//             <tr><td><span class="badge warning">Modüller (SaaS)</span></td><td>E-Ticaret, CRM, Blog, Task gibi tek tıkla kurulabilen, çalışan hazır modüller.</td></tr>
//           </tbody>
//         </table>

//         <h3><i class="ri-user-star-line c-primary"></i>Kimler İçin?</h3>
//         <div class="grid c3">
//           <div class="icard primary"><h6><i class="ri-store-2-line"></i>İşletmeler / KOBİ'ler</h6><p>İç süreçlerini Excel'den çıkarıp profesyonel panellere taşıyanlar — CRM, envanter, sipariş takibi.</p></div>
//           <div class="icard success"><h6><i class="ri-code-box-line"></i>Geliştiriciler</h6><p>Her yeni tablo için sıfırdan CRUD ekranı yazmaktan kurtulup GridBase'i BaaS olarak kullananlar.</p></div>
//           <div class="icard warning"><h6><i class="ri-flashlight-line"></i>Ürün Ekipleri</h6><p>Hızlı prototipleme ve dahili araçlar (internal tools) inşa edenler.</p></div>
//         </div>

//         <div class="alert info"><i class="ri-information-line"></i><div>Sektörde firmalar birbirine çok benzeyen yazılımları (CRM, ERP, e-ticaret panelleri) sürekli sıfırdan geliştiriyor. <strong>WorkGrid bu israfı bitirmek için doğdu</strong> — "Excel basitliğinde, ama Enterprise gücünde bir No-Code işletim sistemi" diye düşünebilirsiniz.</div></div>
//       </section>

//       <!-- 2. FELSEFE -->
//       <section id="philosophy">
//         <div class="sec-head"><span class="sec-ico bg-ico-secondary"><i class="ri-compass-3-line"></i></span><h2>2. Felsefe ve Temel Kavramlar</h2></div>
//         <h3><i class="ri-arrow-right-line c-secondary"></i>Tek Yönlü Bağımlılık: WorkGrid → GridBase</h3>
//         <p>Platformun çekirdeğinde <strong>GridBase</strong> yer alır — ürüne özel hiçbir bilgi içermeyen jenerik bir veri motoru. Tablo, satır, hücre, kolon ve ilişki kavramlarını yönetir ama "e-ticaret", "blog" veya "CRM" gibi hiçbir iş alanını bilmez.</p>
//         <div class="alert warning"><i class="ri-git-branch-line"></i><div><strong>Mimari kural:</strong> GridBase, WorkGrid'i <strong>asla</strong> bilmez. Bağımlılık tek yönlüdür. Bu sayede aynı motor; CRM, e-ticaret, hastane randevu sistemi veya envanter gibi tamamen farklı senaryolarda yeniden kullanılabilir. GridBase ileride bağımsız bir BaaS ürünü olarak ayrılabilecek şekilde tasarlanmıştır.</div></div>

//         <h3><i class="ri-box-3-line c-secondary"></i>Temel Varlıklar (Entities)</h3>
//         <table class="tbl">
//           <thead><tr><th style="width:26%">Kavram</th><th>Açıklama</th></tr></thead>
//           <tbody>
//             <tr><td><code>Datatable</code></td><td>Bir veri tablosu. Kolonları, satırları, modal tasarımı, ilişkileri ve erişim ayarlarını içerir.</td></tr>
//             <tr><td><code>TableColumn</code></td><td>Bir kolon. Tipi (<code>InputTypeEnum</code>), genişliği, doğrulama, ilişki bilgisi (<code>realTableId</code>, <code>realColumnId</code>), fonksiyon metni.</td></tr>
//             <tr><td><code>TableRow</code></td><td>Bir satır (kayıt). İçinde hücreler bulunur.</td></tr>
//             <tr><td><code>TableCell</code></td><td>Bir hücre — belirli bir satır ve kolonun kesişimindeki değer.</td></tr>
//             <tr><td><code>ModalDesign</code></td><td>Kayıt ekleme/düzenleme modalının görsel düzeni (konum, boşluk, genişlik).</td></tr>
//             <tr><td><code>ForeignTableFk</code></td><td>İki tablo arasındaki ilişki tanımı (etiket kolonu dahil).</td></tr>
//             <tr><td><code>TenantConfig</code></td><td>Kiracıya özel ayarlar, feature flag'ler, tema ve marka bilgisi.</td></tr>
//           </tbody>
//         </table>

//         <h3><i class="ri-exchange-2-line c-secondary"></i>EAV ↔ JSON Köprüsü</h3>
//         <p>GridBase verileri arka planda <strong>EAV (Entity-Attribute-Value)</strong> modelinde tutar: <code>Datatable → TableRow → TableCell</code>. Ancak dışarıya, API üzerinden temiz ve tanıdık bir <strong>JSON</strong> olarak sunar:</p>
//         <pre><code>{
//   "id": 5,
//   "name": "deneme",
//   "logoUrl": "deneme &lt;3"
// }</code></pre>
//         <p>Kullanıcı bu JSON'u görür ve onunla çalışır; ama sistem aslında satır ve hücre olarak saklar. Bu, hem dinamik şema esnekliğini hem de geliştirici dostu bir API'yi aynı anda mümkün kılar.</p>
//       </section>

//       <!-- 3. GRIDBASE -->
//       <section id="gridbase">
//         <div class="sec-head"><span class="sec-ico bg-ico-info"><i class="ri-database-2-line"></i></span><h2>3. GridBase — Dinamik Veri Motoru</h2></div>
//         <p>GridBase, WorkGrid'in arkasındaki self-hosted BaaS motorudur. Firebase/Supabase'in sunduğu esnekliği, kendi altyapınızda ve <strong>gerçek ilişkisel veri desteğiyle</strong> sağlar.</p>
//         <div class="grid c2">
//           <div class="icard info"><h6><i class="ri-exchange-line"></i>EAV ↔ JSON Köprüsü</h6><p>Esnek şema, tanıdık JSON arayüzü; otomatik tip çevrimi (number/bool/text/date...).</p></div>
//           <div class="icard primary"><h6><i class="ri-refresh-line"></i>Dinamik CRUD</h6><p><code>GetAll</code>, <code>GetById</code>, <code>GetPaged</code>, <code>Create</code>, <code>Update</code>, <code>Patch</code>, <code>Delete</code>.</p></div>
//           <div class="icard success"><h6><i class="ri-edit-2-line"></i>PATCH (Kısmi Güncelleme)</h6><p><code>null</code> = alanı temizle, alan yok = dokunma.</p></div>
//           <div class="icard warning"><h6><i class="ri-filter-3-line"></i>Gelişmiş Sorgulama</h6><p>Filtreler: eq, neq, gt, gte, lt, lte, contains, startsWith, endsWith, in, isNull, isNotNull.</p></div>
//           <div class="icard secondary"><h6><i class="ri-sort-desc"></i>Sıralama &amp; Sayfalama</h6><p>Tip-duyarlı sıralama (sayı/tarih/metin farkı), <code>PagedResult</code> ile sayfalama.</p></div>
//           <div class="icard danger"><h6><i class="ri-lock-2-line"></i>AccessLevel Yetki</h6><p>Public / Authenticated / RoleBased / Owner; owner süzme, owner damgası, admin bypass, 403.</p></div>
//         </div>
//         <h3><i class="ri-links-line c-info"></i>Foreign Kolon Çözümleme</h3>
//         <p>İlişkili kaydın ham id'si yerine anlamlı etiketini döndürür (tekli + çoklu). Foreign filtreleme ile ilişkili id listesinde arama yapılır.</p>
//         <div class="alert success"><i class="ri-eye-line"></i><div><strong>İki yüzlü kullanım:</strong> GridBase hem <strong>kullanıcı dostu görsel arayüz</strong> hem de <strong>hazır API endpoint'leri</strong> sunar. Kod yazmak istemeyen kullanıcı dinamik modaldan veri girer; geliştirici aynı veriye endpoint üzerinden erişir. Arayüzün yanında gönderilen JSON'u da şeffaf biçimde görürsünüz.</div></div>
//       </section>

//       <!-- 4. MİMARİ -->
//       <section id="architecture">
//         <div class="sec-head"><span class="sec-ico bg-ico-dark"><i class="ri-stack-line"></i></span><h2>4. Mimari</h2></div>
//         <p>WorkGrid, <strong>Clean Architecture</strong>, <strong>Domain-Driven Design (DDD)</strong>, <strong>CQRS</strong> ve <strong>SOLID</strong> prensipleri üzerine kuruludur.</p>
//         <pre class="arch">┌──────────────────────────────────────────────┐
// │         workgrid.Web (React + TS)             │
// │  Component Factory · 40+ input · Modüller     │
// └───────────────────┬──────────────────────────┘
//                     │ REST / JWT / WebSocket (SignalR)
// ┌───────────────────▼──────────────────────────┐
// │           workgrid.WebApi (.NET)              │
// │   Controller'lar · JWT · Middleware · Swagger │
// └───────────────────┬──────────────────────────┘
//                     │ MediatR
// ┌───────────────────▼──────────────────────────┐
// │        workgrid.Application (CQRS)            │
// │  Commands · Queries · Handlers · Behaviors    │
// └───────────────────┬──────────────────────────┘
//                     │
// ┌───────────────────▼──────────────────────────┐
// │            workgrid.Domain                    │
// │  Rich Entities · Events · Value Objects       │
// │  Smart Enums · İş Kuralları (bağımlılık yok)  │
// └───────────────────┬──────────────────────────┘
//                     │
// ┌───────────────────▼──────────────────────────┐
// │        workgrid.Infrastructure                │
// │  EF Core · Repository · UoW · Interceptors    │
// │  Redis · RabbitMQ · MongoDB · Outbox          │
// └──────────────────────────────────────────────┘</pre>

//         <h3><i class="ri-layout-masonry-line c-dark"></i>Katmanlar</h3>
//         <div class="layer"><div class="lt">workgrid.Domain</div><div class="ld">Rich entity'ler, domain event'leri, value object'ler, smart enum'lar, iş kuralları — dış bağımlılık yok.</div></div>
//         <div class="layer"><div class="lt">workgrid.Application → Domain</div><div class="ld">CQRS handler'ları, pipeline behavior'lar, validation, event handler'ları.</div></div>
//         <div class="layer"><div class="lt">workgrid.DTO → Domain</div><div class="ld">Katmanlar arası veri transfer nesneleri.</div></div>
//         <div class="layer"><div class="lt">workgrid.Infrastructure → Application, Domain</div><div class="ld">EF Core, Repository, UnitOfWork, Redis, RabbitMQ, MongoDB, interceptors.</div></div>
//         <div class="layer"><div class="lt">workgrid.WebApi → Application, Infrastructure</div><div class="ld">REST controller'ları, JWT, middleware, DI.</div></div>
//         <div class="layer"><div class="lt">workgrid.FileApi</div><div class="ld">Bağımsız dosya yükleme/indirme servisi.</div></div>
//         <div class="layer"><div class="lt">LoggingApi (MongoDB)</div><div class="ld">NoSQL tabanlı denetim (audit) ve loglama.</div></div>

//         <h3><i class="ri-cpu-line c-dark"></i>Backend Desenleri</h3>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-shield-star-line"></i>Rich Domain Model (DDD)</h6><p>İş kuralları handler'larda değil entity'lerin kalbinde yaşar. <code>private set</code> ile encapsulation, <code>table.Archive()</code> gibi ubiquitous language, value objects, smart enums.</p></div>
//           <div class="icard success"><h6><i class="ri-git-pull-request-line"></i>CQRS + MediatR</h6><p>Query/Command ayrımı. Pipeline Behaviors ile cache invalidation, validation, loglama merkezileştirilir.</p></div>
//           <div class="icard warning"><h6><i class="ri-database-2-line"></i>Repository + UoW</h6><p>İlişkili dinamik hücreler ve cascade silme tek transaction içinde; yarıda kesilirse veri çöpü oluşmaz.</p></div>
//           <div class="icard info"><h6><i class="ri-broadcast-line"></i>Domain Events + Event-Driven Cache</h6><p>Cache tutarlılığı domain event handler'larında. Hücre oluşunca <code>TableCellCreatedEvent</code> ilgili Redis anahtarlarını temizler.</p></div>
//           <div class="icard secondary"><h6><i class="ri-inbox-archive-line"></i>Outbox Pattern</h6><p>Dış işler (Redis/RabbitMQ/mail) Outbox tablosuna yazılır; ana veri ve mesaj tek atomik transaction ile kaydedilir.</p></div>
//           <div class="icard danger"><h6><i class="ri-checkbox-circle-line"></i>Result Pattern + FluentValidation</h6><p>Exception yerine <code>Result&lt;T&gt;</code>; istek doğrulama pipeline'a entegre; global exception middleware.</p></div>
//         </div>

//         <h3><i class="ri-reactjs-line c-dark"></i>Frontend Derinlemesine</h3>
//         <p>GridBase'den gelen kolon tipine göre <strong>çalışma zamanında</strong> hangi React bileşeninin render edileceğine karar veren bir <strong>Component Factory</strong> motoru vardır:</p>
//         <pre class="arch">TableColumn.type (InputTypeEnum)
//         │
//         ├─ Düzenleme  → INPUT_COMPONENT_MAP[type] → &lt;XxxInput /&gt;
//         │
//         └─ Görüntüleme → CELL_COMPONENT_MAP[type]  → &lt;XxxCell /&gt;</pre>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-settings-6-line"></i>Metadata-Driven</h6><p>Davranış (maxSize, format, readonly, hidden) koda gömülü değil; <code>AttributeEnum</code> ve <code>PropertyEnum</code> ile dışarıdan beslenir.</p></div>
//           <div class="icard success"><h6><i class="ri-database-line"></i>TanStack Query</h6><p>Tüm sunucu durumu — otomatik cache, invalidation, stale-while-revalidate. Custom hook katmanı: <code>useGridbaseAll/Paged/ById/Create/Update/Patch/Delete</code>.</p></div>
//           <div class="icard warning"><h6><i class="ri-flashlight-line"></i>Hücre Bazlı Memoization</h6><p><code>MemoizedCell</code> ile yalnızca değişen hücre yeniden render olur; binlerce hücrede bile tablo baştan çizilmez.</p></div>
//           <div class="icard info"><h6><i class="ri-checkbox-multiple-line"></i>Formik + Yup</h6><p>Form durumu + çalışma zamanında üretilen dinamik şema (<code>createDynamicYupSchema</code>). Context mimarisi ile prop-drilling minimize.</p></div>
//         </div>
//       </section>

//       <!-- 5. VERİ TABLOLARI -->
//       <section id="tables">
//         <div class="sec-head"><span class="sec-ico bg-ico-success"><i class="ri-table-line"></i></span><h2>5. Veri Tablosu Yönetimi</h2></div>
//         <p>Veri Tabloları WorkGrid'in temel yapı taşlarıdır. Oluşturduğunuz her tablo CRUD, filtreleme, sayfalama ve düzen kontrolleriyle tam yönetilen bir modüle dönüşür — koda dokunmadan uçtan uca yapılandırılır.</p>
//         <h3><i class="ri-lock-line c-success"></i>Dinamik Tablo İzinleri (AccessLevel)</h3>
//         <table class="tbl">
//           <thead><tr><th style="width:26%">Seviye</th><th>Açıklama</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge success">Public</span></td><td>Herkese açık.</td></tr>
//             <tr><td><span class="badge primary">Authenticated</span></td><td>Giriş yapmış kullanıcılar.</td></tr>
//             <tr><td><span class="badge warning">RoleBased</span></td><td>Belirli rollere.</td></tr>
//             <tr><td><span class="badge danger">Owner</span></td><td>Sadece kaydın sahibine — otomatik owner süzme + admin bypass.</td></tr>
//           </tbody>
//         </table>
//         <h3><i class="ri-window-line c-success"></i>Modal Boyutları</h3>
//         <table class="tbl">
//           <thead><tr><th>Boyut</th><th>En Uygun Kullanım</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge primary">Sm</span></td><td>Hızlı tek alan düzenlemeleri, onaylar.</td></tr>
//             <tr><td><span class="badge primary">Md</span></td><td>3–5 alanlı standart formlar.</td></tr>
//             <tr><td><span class="badge primary">Lg</span></td><td>Çok kolonlu, ayrıntılı kayıtlar.</td></tr>
//             <tr><td><span class="badge primary">Full</span></td><td>Tam ekran çalışma alanı.</td></tr>
//             <tr><td><span class="badge primary">Blank</span></td><td>Yeni sekmede tam sayfa.</td></tr>
//             <tr><td><span class="badge primary">Overlay</span></td><td>Sayfa üstü tam ekran kayan panel.</td></tr>
//           </tbody>
//         </table>
//         <div class="alert info"><i class="ri-information-line"></i><div><strong>Görünüm modları:</strong> Izgara (kart) ve Liste (klasik satır tablosu) arasında geçiş. Sayfa boyutu seçici (7, 10, 25, 50, 100, 500) ile render performansını kontrol edin. Yumuşak silme ile kayıtlar geri yüklenebilir.</div></div>
//       </section>

//       <!-- 6. KOLON & INPUT TİPLERİ -->
//       <section id="columns">
//         <div class="sec-head"><span class="sec-ico bg-ico-info"><i class="ri-list-settings-line"></i></span><h2>6. Kolon &amp; Input Tipleri — Tam Referans</h2></div>
//         <p>Her veri türü için özel tasarlanmış input bileşenleri vardır. Her tip hem <strong>düzenleme modunda</strong> (Input) hem de <strong>liste/görüntüleme modunda</strong> (Cell) ayrı bileşene sahiptir. Hangi bileşenin render edileceğine, kolon tipine göre çalışma zamanında karar verilir.</p>

//         <h4>Metin Tipleri</h4>
//         <table class="tbl">
//           <thead><tr><th style="width:24%">Tip</th><th>Açıklama</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge primary">Text / Tel</span></td><td>Düz metin; prefix/suffix, format kuralı (telefon vb.).</td></tr>
//             <tr><td><span class="badge primary">Textarea</span></td><td>Çok satırlı, uzun metinler.</td></tr>
//             <tr><td><span class="badge primary">Email</span></td><td>E-posta ikonlu, doğrulamalı.</td></tr>
//             <tr><td><span class="badge dark">HTML Editör</span></td><td>CKEditor 5 zengin metin editörü.</td></tr>
//             <tr><td><span class="badge dark">HTML Kod</span></td><td>Monaco Editor ile kod + canlı önizleme.</td></tr>
//           </tbody>
//         </table>

//         <h4>Sayısal Tipler</h4>
//         <table class="tbl">
//           <thead><tr><th style="width:24%">Tip</th><th>Açıklama</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge success">Number</span></td><td>Artır/azalt, step, prefix/suffix, format.</td></tr>
//             <tr><td><span class="badge success">Range</span></td><td>Kaydırıcı + anlık değer.</td></tr>
//             <tr><td><span class="badge success">Ratings</span></td><td>Yıldız (0–5), yarım yıldız desteği.</td></tr>
//           </tbody>
//         </table>

//         <h4>Tarih &amp; Zaman Tipleri</h4>
//         <table class="tbl">
//           <thead><tr><th style="width:32%">Tip</th><th>Format</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge info">Date</span></td><td><code>DD-MM-YYYY</code></td></tr>
//             <tr><td><span class="badge info">DateTime</span></td><td><code>DD-MM-YYYY HH:mm</code></td></tr>
//             <tr><td><span class="badge info">Time</span></td><td><code>HH:mm</code></td></tr>
//             <tr><td><span class="badge info">Month / Week / Quarter / Year</span></td><td><code>YYYY-MM</code> · <code>YYYY-W</code> (ISO) · <code>YYYY-Q</code> · <code>YYYY</code></td></tr>
//             <tr><td><span class="badge info">Multiple Date / Time</span></td><td>Virgüllü tarihler · <code>HH:mm-HH:mm</code></td></tr>
//           </tbody>
//         </table>
//         <p style="font-size:13.5px"><strong>Aralık (Range) tipleri</strong> <code>başlangıç - bitiş</code> formatında saklanır, <code>rangeLimit</code> ile sınırlanır: Range Date, Range DateTime, Range Month, Range Week, Range Quarter, Range Year.</p>

//         <h4>Seçim Tipleri</h4>
//         <table class="tbl">
//           <thead><tr><th style="width:24%">Tip</th><th style="width:24%">Veri Formatı</th><th>Açıklama</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge warning">Select</span></td><td><code>,*,</code> ayraçlı</td><td>Tekli/çoklu açılır liste (react-select).</td></tr>
//             <tr><td><span class="badge warning">Radio</span></td><td>Tek değer</td><td>Seçenekli; seçeneksiz tekli (<code>*1*</code>/<code>*0*</code>).</td></tr>
//             <tr><td><span class="badge warning">Checkbox</span></td><td><code>,*,</code> ayraçlı</td><td>Çoklu onay; seçeneksiz tekli.</td></tr>
//             <tr><td><span class="badge warning">Switch</span></td><td><code>*1*</code> / <code>*0*</code></td><td>Aç/kapa anahtarı, primary renkli.</td></tr>
//           </tbody>
//         </table>

//         <h4>İlişki, Kişi &amp; Etiket Tipleri</h4>
//         <table class="tbl">
//           <thead><tr><th style="width:24%">Tip</th><th style="width:24%">Veri Formatı</th><th>Açıklama</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge secondary">Foreign Column</span></td><td><code>rowId</code> (virgüllü)</td><td>Başka tabloya bağlantı, etiket çözümlemeli.</td></tr>
//             <tr><td><span class="badge secondary">Parent</span></td><td>Ham <code>rowId</code></td><td>Aynı tabloya self-reference (hiyerarşi).</td></tr>
//             <tr><td><span class="badge primary">Users</span></td><td><code>userId</code> (virgüllü)</td><td>Kullanıcı seçici; avatar, baş harf, arama, tekli/çoklu.</td></tr>
//             <tr><td><span class="badge primary">Badges</span></td><td>Virgüllü etiketler</td><td>Serbest etiket girişi, çıkarılabilir rozetler.</td></tr>
//           </tbody>
//         </table>

//         <h4>Medya &amp; Dosya Tipleri</h4>
//         <table class="tbl">
//           <thead><tr><th style="width:24%">Tip</th><th>Açıklama</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge danger">Image</span></td><td>Görsel yükleme + önizleme, sürükle-bırak.</td></tr>
//             <tr><td><span class="badge danger">Image Upload</span></td><td>Ant Design çoklu görsel (picture-card).</td></tr>
//             <tr><td><span class="badge danger">Video Manager</span></td><td>Video yükleme, önizleme, indirme.</td></tr>
//             <tr><td><span class="badge danger">File / Drop</span></td><td>Genel dosya, sürükle-bırak alanı.</td></tr>
//             <tr><td><span class="badge danger">View Image</span></td><td>Görsel galerisi (Swiper).</td></tr>
//           </tbody>
//         </table>

//         <h4>Özel Tipler</h4>
//         <table class="tbl">
//           <thead><tr><th style="width:24%">Tip</th><th>Açıklama</th></tr></thead>
//           <tbody>
//             <tr><td><span class="badge dark">Icon</span></td><td>Aranabilir ikon seçici (Remix Icon), örn. <code>ri-home-line</code>.</td></tr>
//             <tr><td><span class="badge dark">QR Code</span></td><td>Girilen değerden canlı QR üretir.</td></tr>
//             <tr><td><span class="badge dark">Function</span></td><td><code>{{kolonId}}</code> ile diğer kolonlara referanslı hesaplama formülü.</td></tr>
//           </tbody>
//         </table>
//       </section>

//       <!-- 7. İLİŞKİLER -->
//       <section id="relations">
//         <div class="sec-head"><span class="sec-ico bg-ico-warning"><i class="ri-git-merge-line"></i></span><h2>7. İlişkisel Veri Modeli &amp; Relations Tab</h2></div>
//         <p>WorkGrid gerçek ilişkisel veriyi destekler ve bunu görsel bir <strong>Relations (İlişki) sekmesi</strong> üzerinden yönetir — hiç SQL yazmadan.</p>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-links-line"></i>1. Foreign Column (Tablolar Arası)</h6><p><strong>Bağ kolonu</strong> (<code>realTableId</code>+<code>realColumnId</code> dolu), otomatik senkronize <strong>ayna kolonları</strong>, <code>createOrUpdateColumnId</code> ile <strong>etiket çözümleme</strong>, karşı tarafta otomatik <strong>ters ilişki</strong>.</p></div>
//           <div class="icard secondary"><h6><i class="ri-node-tree"></i>2. Parent (Self-Reference)</h6><p>Aynı tablodaki başka kayda bağlanma — kategori ağaçları, organizasyon şemaları. Tek yönlüdür, <strong>ters ilişki oluşturulmaz</strong>. Kayıt kendine parent olamaz.</p></div>
//         </div>
//         <h3><i class="ri-eye-line c-warning"></i>Relations Tab Yetenekleri</h3>
//         <ul>
//           <li>Tablolar arası ilişkileri <strong>görsel olarak</strong> kurma (Foreign Column &amp; Parent).</li>
//           <li>İlişki kurarken: görüntülenecek <strong>etiket kolonu</strong> seçimi, <strong>çoklu seçim (isMulti)</strong>, <strong>düzenlenebilirlik</strong> ayarı.</li>
//           <li>Self-reference için özel davranış: ters ilişki ve ayna kolonu oluşturulmaz; backend ilişkileri "self" ve "normal" olarak ayrıştırır.</li>
//         </ul>
//         <h3><i class="ri-route-line c-warning"></i>Foreign Kolon Nasıl Çalışır</h3>
//         <div class="steps">
//           <div class="step"><span class="n">1</span><p>Yabancı tabloyu oluşturun (örn. bir 'Ürünler' tablosu).</p></div>
//           <div class="step"><span class="n">2</span><p>Ana tablonuza gidin → İlişkiler sekmesi → İlişki Düzenle.</p></div>
//           <div class="step"><span class="n">3</span><p>Yabancı tabloyu seçin; düzenlenebilir &amp; etiket (görüntüleme) kolonlarını yapılandırın.</p></div>
//           <div class="step"><span class="n">4</span><p>Formunuzda Foreign Column girişi belirir — yabancı tabloyu canlı arar.</p></div>
//           <div class="step"><span class="n">5</span><p>Seçilen kaydın id'si saklanır; hücrede ham id yerine anlamlı etiket gösterilir.</p></div>
//         </div>
//       </section>

//       <!-- 8. SATIR DÜZENLE -->
//       <section id="rows">
//         <div class="sec-head"><span class="sec-ico bg-ico-secondary"><i class="ri-file-excel-2-line"></i></span><h2>8. Satır Düzenle — Elektronik Tablo Motoru</h2></div>
//         <p class="lead"><strong>Satır Düzenle</strong> sekmesi tablonuzu canlı, Excel benzeri bir elektronik tabloya dönüştürür. Tüm kayıtlar düzenlenebilir bir matriste — her satır için ayrı modal açmaya gerek yok.</p>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-edit-box-line"></i>Satır İçi Düzenleme</h6><p>Herhangi bir hücreye tıklayın. Değişiklikler kaydedilmeden takip edilir ve toplu işlenir.</p></div>
//           <div class="icard success"><h6><i class="ri-add-line"></i>Satır Ekle</h6><p>Üstte yeni kayıtları anında kabul eden özel ekleme formu. <code>Enter</code> ile fare kullanmadan gönderim.</p></div>
//           <div class="icard danger"><h6><i class="ri-delete-bin-line"></i>Satır Sil</h6><p>Tek tıkla kaldırma; yumuşak silinen satırlar kurtarma için takip edilir.</p></div>
//           <div class="icard warning"><h6><i class="ri-save-3-line"></i>Toplu Kaydet</h6><p>Bekleyen değişiklikler yerel kuyruğa alınır; 'Satırları Kaydet' ile tek seferde işlenir.</p></div>
//           <div class="icard info"><h6><i class="ri-calculator-line"></i>Otomatik Fonksiyonlar</h6><p>Hesaplanan kolonlar bağımlı hücrelere yazdıkça gerçek zamanlı yeniden hesaplanır.</p></div>
//           <div class="icard secondary"><h6><i class="ri-file-upload-line"></i>Dosya Yüklemeleri</h6><p>File, Image, Video ve Drop kolonları satır içi yüklemeyi destekler.</p></div>
//         </div>
//       </section>

//       <!-- 9. DOĞRULAMA -->
//       <section id="validations">
//         <div class="sec-head"><span class="sec-ico bg-ico-danger"><i class="ri-shield-check-line"></i></span><h2>9. Dinamik Doğrulama Kuralları</h2></div>
//         <p>Tabloya ve kolona koda dokunmadan doğrulama kuralları tanımlanır. Kurallar <code>ColumnValidationConfig</code> ve <code>RulesValidationConfig</code> ile saklanır; doğrulama UI düzeyinde Formik/Yup şemasıyla anında çalışır.</p>
//         <div class="grid c2">
//           <div class="icard danger"><h6><i class="ri-asterisk"></i>Zorunlu</h6><p>Alanı zorunlu kılar; boşsa form gönderilemez, etiketin yanında kırmızı (*) görünür.</p></div>
//           <div class="icard warning"><h6><i class="ri-arrow-left-right-line"></i>Min / Max Değer</h6><p>Sayısal alt/üst sınır; eşik dışı girişleri reddeder. Örn. "Puan" 5'i geçemez.</p></div>
//           <div class="icard info"><h6><i class="ri-text-spacing"></i>Min / Max Uzunluk</h6><p>Metin alanları için karakter sınırı. Örn. "Şifre" en az 8 karakter.</p></div>
//           <div class="icard success"><h6><i class="ri-code-s-slash-line"></i>Desen (Regex)</h6><p>Değeri düzenli ifadeyle doğrular. Örn. Telefon <code>^\+90\d{10}$</code>, Seri No <code>^SN-\d{6}$</code>.</p></div>
//         </div>
//       </section>

//       <!-- 10. SEÇENEKLER -->
//       <section id="options">
//         <div class="sec-head"><span class="sec-ico bg-ico-dark"><i class="ri-settings-5-line"></i></span><h2>10. Property / UI Seçenekleri</h2></div>
//         <p>Her kolonun modallerde veya Satır Düzenle'de nasıl render edileceğini, koda dokunmadan kolon bazında kontrol edersiniz. Davranış <code>AttributeEnum</code> ve <code>PropertyEnum</code> ile dışarıdan beslenir.</p>
//         <table class="tbl">
//           <thead><tr><th style="width:24%">Seçenek</th><th>Amaç</th></tr></thead>
//           <tbody>
//             <tr><td><code>Readonly / Disabled</code></td><td>Görünür ama düzenlenemez (readonly değeri gönderir, disabled göndermez).</td></tr>
//             <tr><td><code>Hidden</code></td><td>Alanı form arayüzünden gizler; değer arka planda işlenir.</td></tr>
//             <tr><td><code>Genişlik</code></td><td>12'lik grid sistemi (örn. <code>col-md-6</code>) — yan yana kaç alan duracağını belirler.</td></tr>
//             <tr><td><code>Etiket / Yer Tutucu</code></td><td>Görüntüleme adı ve giriş içi hayalet metin.</td></tr>
//             <tr><td><code>Varsayılan Değer</code></td><td>Yeni form açıldığında girişi önceden doldurur.</td></tr>
//             <tr><td><code>Prefix / Suffix</code></td><td>Değerden önce/sonra metin. Örn. <code>₺</code>, <code>kg</code>, <code>%</code>.</td></tr>
//             <tr><td><code>autoFocus / Yardım Metni</code></td><td>Otomatik odak ve alan altı yardımcı not.</td></tr>
//             <tr><td><code>Seçenekler / Multiple</code></td><td>Select/Checkbox/Radio listesi; Select için çoklu seçim modu.</td></tr>
//             <tr><td><code>Accept / Maks Boyut</code></td><td>Dosya türü kısıtı (<code>image/*</code>, <code>.pdf</code>) ve maksimum boyut (MB).</td></tr>
//             <tr><td><code>Format / Step / Range Limit</code></td><td>Sayı biçimi (para/yüzde/IBAN), artış adımı, tarih aralığı maks. gün.</td></tr>
//           </tbody>
//         </table>
//         <div class="alert success"><i class="ri-brush-line"></i><div><strong>Dinamik CSS / Class:</strong> Tasarımda hücre ve kolon seviyesine kadar inline CSS ve class ekleyebilirsiniz — görünüm tamamen kullanıcının kontrolünde.</div></div>
//       </section>

//       <!-- 11. FONKSİYONLAR -->
//       <section id="functions">
//         <div class="sec-head"><span class="sec-ico bg-ico-success"><i class="ri-functions"></i></span><h2>11. Kolonlar Arası Fonksiyon Motoru</h2></div>
//         <p class="lead">Bir kolon, diğer kolonların değerlerine <code>{{kolonId}}</code> ile referans veren bir formül olabilir. Motor, her bağımlılık değiştiğinde ifadeyi gerçek zamanlı, backend'e gitmeden değerlendirir.</p>
//         <div class="alert info"><i class="ri-information-line"></i><div>Örneğin <code>{{12}} * {{15}}</code>, 12 ve 15 numaralı kolonların değerlerini çarpar (<code>amount * price = total</code>). Bağımlı kolonlar değiştikçe sonuç frontend düzeyinde otomatik güncellenir.</div></div>
//         <div class="grid c2">
//           <div class="icard success"><h6><i class="ri-money-dollar-circle-line"></i>Finans ve Faturalama</h6>
//             <div class="func"><code>{{miktar}} * {{fiyat}}</code><span>→ Toplam = Miktar × Fiyat</span></div>
//             <div class="func"><code>{{ara_toplam}} * 1.20</code><span>→ %20 KDV dahil toplam</span></div>
//             <div class="func"><code>{{ara_toplam}} - {{indirim}}</code><span>→ İndirim sonrası net fiyat</span></div>
//             <div class="func"><code>{{gelir}} - {{maliyet}}</code><span>→ Brüt kâr marjı</span></div>
//           </div>
//           <div class="icard info"><h6><i class="ri-archive-line"></i>Stok ve Envanter</h6>
//             <div class="func"><code>{{stok}} - {{rezerve}}</code><span>→ Serbest stok miktarı</span></div>
//             <div class="func"><code>{{stok}} / {{kapasite}} * 100</code><span>→ Doluluk yüzdesi</span></div>
//             <div class="func"><code>{{kapasite}} - {{kullanilan}}</code><span>→ Kullanılabilir alan</span></div>
//           </div>
//           <div class="icard warning"><h6><i class="ri-text"></i>Metin Birleştirme</h6>
//             <div class="func"><code>"SN-" + {{yil}} + "-" + {{id}}</code><span>→ Seri no: SN-2024-001</span></div>
//             <div class="func"><code>{{ad}} + " " + {{soyad}}</code><span>→ Tam ad birleştirme</span></div>
//           </div>
//           <div class="icard primary"><h6><i class="ri-bar-chart-line"></i>İK ve Operasyonlar</h6>
//             <div class="func"><code>{{calisilan_gun}} * {{gunluk_ucret}}</code><span>→ Aylık maaş</span></div>
//             <div class="func"><code>{{gerceklesen}} / {{hedef}} * 100</code><span>→ Hedef tamamlanma %</span></div>
//             <div class="func"><code>{{taban}} + {{prim}} - {{kesinti}}</code><span>→ Net bordro</span></div>
//           </div>
//         </div>
//       </section>

//       <!-- 12. TASARIM -->
//       <section id="designs">
//         <div class="sec-head"><span class="sec-ico bg-ico-primary"><i class="ri-palette-line"></i></span><h2>12. Tasarım Sekmesi — CSS &amp; Class Enjeksiyonu</h2></div>
//         <p class="lead">Belirli kolon örneklerine doğrudan kapsamlı <strong>CSS sınıfları</strong> ve <strong>koşullu ifadeler</strong> enjekte ederek görünümü tamamen kontrol edebilirsiniz.</p>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-brush-4-line"></i>CSS Sınıf Enjeksiyonu</h6><p>Hücreye herhangi bir Bootstrap veya özel CSS sınıfı ekleyin.</p>
//             <div style="margin-top:8px"><span class="codechip">text-danger fw-bold</span> <span class="codechip">badge bg-success-subtle</span></div>
//           </div>
//           <div class="icard success"><h6><i class="ri-code-s-slash-line"></i>Koşullu İfadeler</h6><p>Hücre değerine göre koşullu stiller uygulayın.</p>
//             <div style="margin-top:8px"><span class="codechip">val &gt; 100 ? 'text-danger' : 'text-success'</span></div>
//           </div>
//         </div>
//         <div class="alert warning"><i class="ri-lightbulb-line"></i><div><strong>Örnek:</strong> 10'un altında <strong class="c-danger">kırmızı</strong>, 50'nin altında <strong class="c-warning">sarı</strong>, aksi halde <strong class="c-success">yeşil</strong> dönen bir "Stok Seviyesi" kolonu — tek bir bileşene dokunmadan.</div></div>
//       </section>

//       <!-- 13. MODAL -->
//       <section id="modals">
//         <div class="sec-head"><span class="sec-ico bg-ico-warning"><i class="ri-window-line"></i></span><h2>13. Modal Tasarım Editörü</h2></div>
//         <p class="lead">Her tablo için kayıt ekleme/düzenleme modalı, herhangi bir düzen kodu yazmadan görsel olarak tasarlanır.</p>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-drag-move-2-line"></i>Sürükle-Bırak Yerleşim</h6><p>Kolonları modal içinde istediğiniz konuma taşıyın.</p></div>
//           <div class="icard success"><h6><i class="ri-layout-column-line"></i>Genişlik (12'lik grid)</h6><p>Her alanın ızgara genişliğini ayarlayın; yan yana kaç alan duracağını kontrol edin.</p></div>
//           <div class="icard secondary"><h6><i class="ri-space"></i>Boşluk Kontrolü</h6><p>Her kolon için üst/alt/sol/sağ boşluk.</p></div>
//           <div class="icard warning"><h6><i class="ri-eye-line"></i>Görünürlük</h6><p>Kolonları tablo görünürlüğünden bağımsız modalda gizle/göster.</p></div>
//           <div class="icard info"><h6><i class="ri-arrow-up-down-line"></i>Yeniden Boyutlandırma</h6><p>Modal yüksekliğini sürükleyerek ayarlama.</p></div>
//           <div class="icard danger"><h6><i class="ri-refresh-line"></i>Canlı Önizleme &amp; Sıfırlama</h6><p>"Önizleme" ↔ "Modalı Göster" geçişi; geri alma ve tamamen sıfırlama.</p></div>
//         </div>
//       </section>

//       <!-- 14. MULTI-TENANT -->
//       <section id="tenant">
//         <div class="sec-head"><span class="sec-ico bg-ico-secondary"><i class="ri-building-line"></i></span><h2>14. Multi-Tenant &amp; White-Label</h2></div>
//         <p>WorkGrid baştan sona <strong>çok kiracılı (multi-tenant)</strong> ve <strong>beyaz etiketli (white-label)</strong> olarak tasarlanmıştır.</p>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-community-line"></i>Çoklu Kiracılık</h6><p>Yüzlerce müşteri aynı sistem üzerinde, tamamen izole, kendi çalışma alanlarıyla.</p></div>
//           <div class="icard secondary"><h6><i class="ri-palette-line"></i>White-Label</h6><p>Navbar stili, logo konumu, primary/secondary kurumsal renkler, hücre seviyesine kadar inline CSS.</p></div>
//           <div class="icard success"><h6><i class="ri-toggle-line"></i>Feature Flag (FeatureGuard)</h6><p>Modüller kiracı bazında açılır/kapanır: <code>showCrm</code>, <code>showECommerce</code>, <code>showCalendar</code>, <code>showChat</code>, <code>showTask</code>, <code>showLanding</code>, <code>showBlog</code>.</p></div>
//           <div class="icard info"><h6><i class="ri-settings-3-line"></i>TenantConfig</h6><p>Kiracıya özel tüm ayarlar, tema ve marka bilgisi merkezi olarak yönetilir.</p></div>
//         </div>
//         <div class="alert info"><i class="ri-information-line"></i><div>Sitedeki hiçbir içerik statik değildir — About, FAQ, Gallery, menü öğeleri, landing dahil her şey veritabanından dinamik gelir ve kiracıya göre değişir.</div></div>
//       </section>

//       <!-- 15. GÜVENLİK -->
//       <section id="security">
//         <div class="sec-head"><span class="sec-ico bg-ico-danger"><i class="ri-shield-user-line"></i></span><h2>15. Güvenlik &amp; Yetkilendirme</h2></div>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-key-2-line"></i>JWT Kimlik Doğrulama</h6><p>JWT tabanlı giriş/çıkış; ASP.NET Core Identity üzerine inşa.</p></div>
//           <div class="icard warning"><h6><i class="ri-user-settings-line"></i>Rol Bazlı Erişim</h6><p><code>WG</code>, <code>Admin</code>, <code>User</code> rolleri. Personel (WG/Admin/User), admin (WG/Admin), süper-admin (WG).</p></div>
//           <div class="icard success"><h6><i class="ri-shield-keyhole-line"></i>FeatureGuard</h6><p>Hem role hem feature flag'e göre sayfa/komponent koruması.</p></div>
//           <div class="icard info"><h6><i class="ri-lock-2-line"></i>Tablo Bazlı Erişim</h6><p>AccessLevel ile satır/tablo seviyesinde yetki, owner süzme, admin bypass.</p></div>
//         </div>
//         <div class="alert danger"><i class="ri-shield-flash-line"></i><div>Hassas yapılandırma (<code>.env</code>, <code>appsettings</code>) sürüm kontrolüne dahil edilmez. Yönetici güvenlik koruyucuları, bir yöneticinin yanlışlıkla kendi silme işlemini gerçekleştirmesini <code>IHttpContextAccessor</code> ile engeller.</div></div>
//       </section>

//       <!-- 16. MODÜLLER -->
//       <section id="modules">
//         <div class="sec-head"><span class="sec-ico bg-ico-info"><i class="ri-apps-2-line"></i></span><h2>16. Hazır Modüller</h2></div>
//         <p>Tüm modüller backend'e bağlı, gerçek veriyle çalışır ve FeatureGuard ile kiracı bazında açılıp kapatılabilir.</p>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-home-4-line"></i>Dinamik Landing</h6><p>Tek sayfa tanıtım ekranı, kiracıya göre dinamik (<code>showLanding</code>).</p></div>
//           <div class="icard success"><h6><i class="ri-dashboard-line"></i>Dashboard</h6><p>Genel bakış ve özet; giriş sonrası ana karşılama paneli.</p></div>
//           <div class="icard warning"><h6><i class="ri-table-2"></i>GridBase / Datatables (Çekirdek)</h6><p>Dinamik tablolar, kolonlar, ilişkiler, validation, modal editör, EditRow. <code>/datatables</code>, <code>/datatable/:id</code>.</p></div>
//           <div class="icard danger"><h6><i class="ri-shopping-cart-2-line"></i>E-Ticaret</h6><p>Mağaza, ürünler, sepet, ödeme, siparişler, faturalar, kuponlar, yorumlar (<code>showECommerce</code>).</p></div>
//           <div class="icard info"><h6><i class="ri-article-line"></i>Blog</h6><p>Liste, detay, oluştur/düzenle, yorum paneli (<code>showBlog</code>).</p></div>
//           <div class="icard secondary"><h6><i class="ri-kanban-view"></i>Task (Kanban)</h6><p>Projeler, Kanban panosu, görev detayı, yapılacaklar (<code>showTask</code>).</p></div>
//           <div class="icard primary"><h6><i class="ri-calendar-line"></i>Calendar</h6><p>Etkinlik ve tarih yönetimi (<code>showCalendar</code>).</p></div>
//           <div class="icard success"><h6><i class="ri-chat-3-line"></i>Chat</h6><p>Mesajlaşma modülü (<code>showChat</code>).</p></div>
//           <div class="icard warning"><h6><i class="ri-chat-quote-line"></i>Comments</h6><p>Blog ve ürünlere bağlanabilen ortak yorum sistemi (tek panel).</p></div>
//           <div class="icard info"><h6><i class="ri-menu-2-line"></i>Menü Yönetimi</h6><p>Dinamik, sürükle-bırak, iç içe, kilitlenebilir menü öğeleri (<code>/menuItems</code>).</p></div>
//           <div class="icard secondary"><h6><i class="ri-group-line"></i>Kullanıcı &amp; Rol</h6><p>Kullanıcı (<code>/users</code>) ve rol (<code>/roles</code>) yönetimi.</p></div>
//           <div class="icard danger"><h6><i class="ri-file-list-3-line"></i>Statik Olmayan İçerik</h6><p>About, FAQ, Gallery, İletişim, Gizlilik, Şartlar — hepsi dinamik.</p></div>
//         </div>
//       </section>

//       <!-- 17. TEKNOLOJİ -->
//       <section id="stack">
//         <div class="sec-head"><span class="sec-ico bg-ico-dark"><i class="ri-tools-line"></i></span><h2>17. Teknoloji Yığını</h2></div>
//         <div class="techbox">
//           <h6><i class="ri-server-line"></i>Backend</h6>
//           <div class="chips">
//             <span class="badge success">.NET / ASP.NET Core</span><span class="badge success">Entity Framework Core</span><span class="badge primary">MediatR (CQRS)</span><span class="badge primary">Clean Architecture</span><span class="badge primary">DDD</span><span class="badge warning">FluentValidation</span><span class="badge danger">Redis</span><span class="badge danger">RabbitMQ</span><span class="badge info">MongoDB</span><span class="badge secondary">SignalR</span><span class="badge dark">JWT</span><span class="badge dark">Swagger / OpenAPI</span>
//           </div>
//         </div>
//         <div class="techbox">
//           <h6><i class="ri-reactjs-line"></i>Frontend</h6>
//           <div class="chips">
//             <span class="badge primary">React + TypeScript</span><span class="badge info">TanStack Query</span><span class="badge success">Formik + Yup</span><span class="badge warning">Reactstrap / Bootstrap</span><span class="badge secondary">Ant Design</span><span class="badge dark">CKEditor 5</span><span class="badge dark">Monaco Editor</span><span class="badge primary">Day.js</span><span class="badge info">SimpleBar / Swiper</span><span class="badge dark">Remix Icon</span>
//           </div>
//         </div>
//         <div class="alert info"><i class="ri-information-line"></i><div>Durum yönetimi <strong>TanStack Query + Context + Formik/Yup</strong> üzerine kuruludur. <strong>%100 TypeScript</strong> — <code>any</code>'den kaçınılır, DTO ile frontend pürüzsüz konuşur. Day.js ISO Week, Quarter ve custom range plugin'leriyle gelişmiş tarih/zaman yönetimi sağlar.</div></div>
//       </section>

//       <!-- 18. YOL HARİTASI -->
//       <section id="roadmap">
//         <div class="sec-head"><span class="sec-ico bg-ico-primary"><i class="ri-rocket-2-line"></i></span><h2>18. Yol Haritası — Yakında Gelecekler</h2></div>
//         <h3><i class="ri-cpu-line c-primary"></i>Yapay Zeka &amp; Görsel Zeka</h3>
//         <div class="grid c2">
//           <div class="icard primary"><h6><i class="ri-robot-line"></i>AI Entegrasyonu</h6><p>"Konuşarak tablo/sayfa oluştur" — Natural Language → UI/DB.</p></div>
//           <div class="icard success"><h6><i class="ri-camera-line"></i>OpenCV Entegrasyonu</h6><p>Fatura/belge fotoğrafını tarayıp otomatik tablo+kolon+hücre; manuel girişi ~%90 azaltma.</p></div>
//         </div>
//         <h3><i class="ri-layout-line c-primary"></i>Platform &amp; UX</h3>
//         <div class="grid c2">
//           <div class="icard info"><h6><i class="ri-dashboard-3-line"></i>Dinamik Dashboard</h6><p>Kullanıcının kendi ekleyebildiği widget'lar.</p></div>
//           <div class="icard warning"><h6><i class="ri-sticky-note-line"></i>Yapışkan Notlar</h6><p>Ana ekranda hatırlatma notları.</p></div>
//           <div class="icard secondary"><h6><i class="ri-paint-brush-line"></i>Kendi Sayfa Tasarımı</h6><p>Kullanıcının kendi route'unu açıp sayfayı sıfırdan tasarlaması.</p></div>
//           <div class="icard primary"><h6><i class="ri-smartphone-line"></i>Çoklu Platform Export</h6><p>Mobil, masaüstü ve tablet sürümleri.</p></div>
//           <div class="icard success"><h6><i class="ri-guide-line"></i>Tour / Onboarding</h6><p>Adım adım interaktif sistem tanıtımı.</p></div>
//           <div class="icard info"><h6><i class="ri-translate-2"></i>i18n / Çoklu Dil</h6><p><code>tr.json</code>, <code>en.json</code> ile çok dilli arayüz.</p></div>
//         </div>
//         <h3><i class="ri-database-2-line c-primary"></i>Veri &amp; İş Mantığı</h3>
//         <div class="grid c2">
//           <div class="icard success"><h6><i class="ri-shield-check-line"></i>Validation → CRUD</h6><p>Doğrulamanın GridBase create/update akışına tam entegrasyonu.</p></div>
//           <div class="icard warning"><h6><i class="ri-functions"></i>Tablo Bazlı Function</h6><p>Tablo geneli hesaplama ve tablolar arası veri hesabı.</p></div>
//           <div class="icard danger"><h6><i class="ri-links-line"></i>Foreign Key Doğrulama</h6><p>Var olmayan id'lerin reddi (öksüz kayıt engelleme).</p></div>
//           <div class="icard info"><h6><i class="ri-refresh-line"></i>Transaction / Atomik İşlem</h6><p>Sipariş + stok gibi işlemlerin tek bütün olarak yürütülmesi.</p></div>
//           <div class="icard primary"><h6><i class="ri-search-line"></i>Gelişmiş Arama</h6><p>Full-text arama, gelişmiş tarih filtresi.</p></div>
//           <div class="icard secondary"><h6><i class="ri-file-excel-2-line"></i>Excel Import</h6><p>Excel'den toplu veri içe aktarma.</p></div>
//         </div>
//         <h3><i class="ri-secure-payment-line c-primary"></i>Güvenlik &amp; Ticarileşme</h3>
//         <div class="grid c2">
//           <div class="icard danger"><h6><i class="ri-time-line"></i>Rate Limiting + Refresh Token</h6><p>API güvenliği ve oturum yenileme.</p></div>
//           <div class="icard info"><h6><i class="ri-links-line"></i>Route Slug</h6><p>URL'lerde sayı yerine okunabilir metin.</p></div>
//           <div class="icard success"><h6><i class="ri-bank-card-line"></i>Para Kazanma</h6><p>Freemium kademe limitleri, ücretsiz sürüm için reklam alanları.</p></div>
//           <div class="icard warning"><h6><i class="ri-mail-send-line"></i>Mail / SMS Sender</h6><p>Hesap onaylama ve bildirimler.</p></div>
//         </div>
//         <div class="alert info"><i class="ri-planet-line"></i><div><strong>Uzak vizyon:</strong> Anomali tespiti (akıllı bekçi), sesli komut (hands-free veri girişi), AI ile dinamik export sihirbazı, offline-first mobil ve App Store / Google Play / masaüstü dağıtımı.</div></div>
//       </section>

//     </div>
//   </main>
// </div>

// <script>
//   const side=document.getElementById('side'),btn=document.getElementById('menuBtn'),bd=document.getElementById('backdrop');
//   btn.addEventListener('click',()=>{side.classList.toggle('open');bd.classList.toggle('show')});
//   bd.addEventListener('click',()=>{side.classList.remove('open');bd.classList.remove('show')});
//   const links=[...document.querySelectorAll('.nav a')];
//   const map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
//   const obs=new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting){links.forEach(l=>l.classList.remove('active'));const a=map.get(x.target.id);if(a)a.classList.add('active')}})},{rootMargin:'-10% 0px -80% 0px',threshold:0});
//   document.querySelectorAll('section[id]').forEach(s=>obs.observe(s));
//   links.forEach(a=>a.addEventListener('click',()=>{side.classList.remove('open');bd.classList.remove('show')}));
// </script>
// </body>
// </html>