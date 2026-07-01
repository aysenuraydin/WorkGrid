import React from 'react'
import { Alert } from 'reactstrap';
const colorTypes = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];
interface TenantTestPageProps {
    color?: string; // Dışarıdan "primary", "success", "danger", "warning", "info" vb. alabilir
}

export default function TenantTestPage({ color = "primary" }: TenantTestPageProps) {
    // Küçük harfe zorlayarak hatalı yazımların önüne geçiyoruz
    const activeColor = color.toLowerCase();

    return (
        <div className="container-fluid p-4">
            {/* BAŞLIK VE ÖZET BİLGİ */}
            <h3 className={`text-${color}`}>{color}</h3> <hr />
            <div className="row mb-4">
                <div className="col-12">
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between p-3 bg-light rounded border">
                        <div>
                            <h4 className={`mb-1 text-capitalize text-${activeColor}-emphasis`}>
                                {activeColor} Teması Stres Test Alanı
                            </h4>
                            <p className="text-muted mb-0 small">
                                Seçili olan ana rengin ve türetilen sınıfların sistemdeki tüm bileşenlere uyumu kontrol ediliyor.
                            </p>
                        </div>
                        <div className="page-title-right">
                            <span className={`badge bg-${activeColor} p-2 fs-13 text-uppercase me-2`}>
                                AKTİF: {activeColor}
                            </span>
                            <span className={`badge badge-subtle-${activeColor} p-2 fs-13 text-uppercase`}>
                                SUBTLE MODU
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        <Alert className={`alert-${color} text-center mb-2 mx-2`} role="alert">
                    Enter your email and instructions will be sent to you!
        </Alert>
            {/* ─── 1. BÖLÜM: TÜM BUTON VE ETKİLEŞİM VARYASYONLARI ─── */}
            <div className={`card card-border-${activeColor} mb-4`}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0 text-capitalize">{activeColor} Buton Etkileşim Matrisi</h5>
                    <span className="text-muted small">Hover, Active ve Focus durumlarını test edin</span>
                </div>
                <div className="card-body">
                    <div className="row g-3 text-center">
                        <div className="col-md-3">
                            <label className="form-label d-block text-muted small">Standart (Solid)</label>
                            <button className={`btn btn-${activeColor} w-100`}>
                                .btn-{activeColor}
                            </button>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label d-block text-muted small">Çerçeveli (Outline)</label>
                            <button className={`btn btn-outline-${activeColor} w-100`}>
                                .btn-outline-{activeColor}
                            </button>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label d-block text-muted small">Yumuşak (Soft Button)</label>
                            <button className={`btn btn-soft-${activeColor} w-100`}>
                                .btn-soft-{activeColor}
                            </button>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label d-block text-muted small">Bağlantı (Link Yapısı)</label>
                            <div className="p-2 border rounded bg-light">
                                <a href="#" className={`link-${activeColor} fw-bold`}>
                                    .link-{activeColor}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── 2. BÖLÜM: YAZI TONLAMALARI VE BİLDİRİMLER ─── */}
            <div className="row">
                {/* Sol Kadran: Renk Tipografisi ve Rozetler */}
                <div className="col-xl-6">
                    <div className="card mb-4" style={{ borderTop: `3px solid var(--vz-${activeColor})` }}>
                        <div className="card-header">
                            <h5 className="card-title mb-0">Tipografi ve Rozet Kontrastı</h5>
                        </div>
                        <div className="card-body">
                            <div className="p-3 mb-3 border rounded bg-light">
                                <h6 className="text-muted small mb-2">Metin Renkleri Kontrast Analizi (Arka plan beyazken)</h6>
                                <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white border rounded">
                                    <span>Ham Renk Sınıfı:</span>
                                    <span className={`text-${activeColor} fw-bold fs-15`}>.text-{activeColor}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-2 bg-white border rounded">
                                    <span>Okunabilirlik Ayarlı (Emphasis):</span>
                                    <span className={`text-${activeColor}-emphasis fw-bold fs-15`}>.text-{activeColor}-emphasis</span>
                                </div>
                            </div>

                            <h6 className="text-muted small mb-2">Rozet (Badge) Varyasyonları</h6>
                            <div className="d-flex gap-3">
                                <div className={`p-3 bg-${activeColor} text-white rounded text-center flex-fill`}>
                                    <span className="d-block small mb-1">Solid Arka Plan</span>
                                    <span className={`badge bg-white text-${activeColor}`}>Badge Solid</span>
                                </div>
                                <div className={`p-3 bg-${activeColor}-subtle rounded text-center flex-fill border border-${activeColor}-subtle`}>
                                    <span className={`d-block small mb-1 text-${activeColor}-emphasis`}>Subtle Arka Plan</span>
                                    <span className={`badge bg-${activeColor}`}>Badge Subtle</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sağ Kadran: Alert Panelleri */}
                <div className="col-xl-6">
                    <div className="card mb-4" style={{ borderTop: `3px solid var(--vz-${activeColor})` }}>
                        <div className="card-header">
                            <h5 className="card-title mb-0">Bildirim Kutusu (Alert Component)</h5>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-center h-100">
                            <div className={`alert alert-${activeColor} mb-3`} role="alert">
                                <h4 className={`alert-heading text-capitalize text-${activeColor}-emphasis`}>
                                    {activeColor} Bildirimi Başlığı
                                </h4>
                                <p className="mb-2">
                                    Bu kutu, kiracının şeffaf katman renk yapısını (`bg-subtle` ve `border-subtle`) test eder. İçerideki metinlerin arka plan üzerinde patlamadan okunması gerekir.
                                </p>
                                <hr className={`border-${activeColor}-subtle`} />
                                <p className="mb-0 small">
                                    Daha fazla detay için <a href="#" className="alert-link">bu etkileşimli alert linkine</a> tıklayabilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── 3. BÖLÜM: TABLOLAR VE FORM ELEMANLARI ─── */}
            <div className="row">
                {/* Form Yapıları */}
                <div className="col-xl-6">
                    <div className="card mb-4" style={{ borderTop: `3px solid var(--vz-${activeColor})` }}>
                        <div className="card-header">
                            <h5 className="card-title mb-0">Form Odaklanma Etkileri (Focus State)</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Input Focus Durumu</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Buraya tıklayınca etrafında parlayan border efekti bu temaya göre şekillenir..." 
                                />
                            </div>
                            
                            <div className="row align-items-center mt-4">
                                <div className="col-md-6">
                                    <div className={`form-check form-check-${activeColor}`}>
                                        <input className={`form-check-input bg-${activeColor}`} type="checkbox" id="tenantCheck" defaultChecked />
                                        <label className="form-check-label fw-medium" htmlFor="tenantCheck">
                                            Seçili Checkbox (.form-check-input)
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className={`form-check form-check-${activeColor}`}>
                                        <input className={`form-check-input bg-${activeColor}`} type="radio" id="tenantRadio" defaultChecked />
                                        <label className="form-check-label fw-medium" htmlFor="tenantRadio">
                                            Seçili Radio (.form-check-input)
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className={`form-check form-switch form-switch-${activeColor}`}>
                                        <input className={`form-check-input bg-${activeColor}`} type="checkbox" id="tenantSwitch" defaultChecked />
                                        <label className="form-check-label fw-medium" htmlFor="tenantSwitch">
                                            Aktif Switch Anahtarı
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigasyon, Tab ve Listeler */}
                <div className="col-xl-6">
                    <div className="card mb-4" style={{ borderTop: `3px solid var(--vz-${activeColor})` }}>
                        <div className="card-header">
                            <h5 className="card-title mb-0">Navigasyon ve Sayfalama (Tabs & Lists & Pagination)</h5>
                        </div>
                        <div className="card-body">
                            {/* Tabs */}
                            <ul className="nav nav-tabs nav-tabs-custom mb-3" role="tablist">
                                <li className="nav-item">
                                    {/* 'text-' sınıfını doğrudan buradaki active linkine gömüyoruz */}
                                    <a className={`nav-link active text-${activeColor}`} data-bs-toggle="tab" href="#" role="tab">
                                        Aktif Alt Çizgili Sekme
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-bs-toggle="tab" href="#" role="tab">
                                        Pasif Sekme
                                    </a>
                                </li>
                            </ul>

                            {/* Pagination & List */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className="page-item">
                                            <a className={`page-link text-${activeColor}`} href="#">1</a>
                                        </li>
                                        <li className="page-item active">
                                            <a className={`page-link bg-${activeColor} border-${activeColor}`} href="#">
                                                2 (Aktif)
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className={`page-link text-${activeColor}`} href="#">3</a>
                                        </li>
                                    </ul>
                                </nav>

                                <div className="list-group w-50">
                                    <div className={`list-group-item list-group-item-${activeColor} py-2 text-center small fw-bold`}>
                                        .list-group-item-{activeColor}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── 4. BÖLÜM: TABLO VE ASENKRON SİSTEM ELEMANLARI ─── */}
            <div className="row">
                {/* Tablo Test Alanı */}
                <div className="col-xl-8">
                    <div className="card mb-4">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0 text-capitalize">{activeColor} Tablo Satır Vurgusu</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-bordered mb-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th>Sınıf Modeli</th>
                                            <th>Arka Plan Katmanı</th>
                                            <th>Yazı Kontrastı</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fw-medium">Normal Satır</td>
                                            <td>Varsayılan Sistem Rengi</td>
                                            <td>Standart Body Rengi</td>
                                        </tr>
                                        <tr className={`table-${activeColor}`}>
                                            <td className="fw-bold">.table-{activeColor}</td>
                                            <td>Dinamik Şeffaf `{activeColor}` Arka Planı</td>
                                            <td>Okunabilir Modifiye Tipografi Rengi</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Diğer Normal Satır</td>
                                            <td>Varsayılan Sistem Rengi</td>
                                            <td>Standart Body Rengi</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Yükleme / İlerleme Elemanları */}
                <div className="col-xl-4">
                    <div className="card mb-4">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">Sistem İlerleme Elemanları</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-4">
                                <label className="form-label fw-semibold small d-block mb-2">
                                    Yükleme Çubuğu (.progress-bar)
                                </label>
                                <div className="progress" style={{ height: "14px" }}>
                                    <div 
                                        className={`progress-bar bg-${activeColor}`} 
                                        role="progressbar" 
                                        style={{ width: "65%" }} 
                                        aria-valuenow={65} 
                                        aria-valuemin={0} 
                                        aria-valuemax={100}
                                    >
                                        65%
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="form-label fw-semibold small d-block mb-2">
                                    Dinamik Spinner Entegrasyonu
                                </label>
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`spinner-border text-${activeColor}`} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <div className={`spinner-grow text-${activeColor}`} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span className={`text-${activeColor} fw-medium small`}>
                                        İşlem Yükleniyor...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}