import { Card, CardBody, CardHeader, Row, Col, Input, Table, Badge } from "reactstrap";
import { ComboRow, LocalOption, LocalType } from "../hooks/useProductForm";

interface Props {
  isEdit: boolean;
  currencyCode?: string;
  vTypes: LocalType[];
  newTypeName: string;
  setNewTypeName: (v: string) => void;
  newTypeDisplay: string;
  setNewTypeDisplay: (v: string) => void;
  optionInputs: Record<string, { value: string; colorHex: string }>;
  setOptionInputs: React.Dispatch<React.SetStateAction<Record<string, { value: string; colorHex: string }>>>;
  addType: () => void;
  removeType: (t: LocalType) => void;
  addOption: (t: LocalType) => void;
  removeOption: (t: LocalType, o: LocalOption) => void;
  combos: ComboRow[];
  updateCombo: (key: string, field: keyof ComboRow, value: any) => void;
  saveCombo: (c: ComboRow) => void;
  variantError: string;
}

export const ProductVariants = (p: Props) => (
  <>
    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">1. Eksenler ve Seçenekler</h5></CardHeader>
      <CardBody>
        <Row className="g-2 align-items-end mb-4">
          <Col md={4}>
            <label className="form-label fs-13">Yeni Eksen Adı</label>
            <Input bsSize="sm" placeholder="Renk, Beden, Boyut..." value={p.newTypeName}
              onChange={(e) => p.setNewTypeName(e.target.value)} />
          </Col>
          <Col md={4}>
            <label className="form-label fs-13">Gösterim Tipi</label>
            <Input type="select" bsSize="sm" value={p.newTypeDisplay} onChange={(e) => p.setNewTypeDisplay(e.target.value)}>
              <option value="button">Buton (Beden, Boyut)</option>
              <option value="color-swatch">Renk Yuvarlağı</option>
              <option value="dropdown">Açılır Liste</option>
            </Input>
          </Col>
          <Col md={4}>
            <button type="button" className="btn btn-primary btn-sm" onClick={p.addType}>
              <i className="ri-add-line align-bottom me-1" /> Eksen Ekle
            </button>
          </Col>
        </Row>

        {p.variantError && <div className="text-danger fs-13 mb-2">{p.variantError}</div>}

        {p.vTypes.length === 0 ? (
          <div className="text-muted fs-13">Henüz eksen yok. Yukarıdan ekle (ör. Renk, Beden).</div>
        ) : (
          <Row>
            {p.vTypes.map((type) => {
              const isColor = (type.displayType ?? "").toLowerCase().includes("color");
              const inp = p.optionInputs[type.localId] ?? { value: "", colorHex: "#000000" };
              return (
                <Col md={6} key={type.localId} className="mb-3">
                  <Card className="border shadow-none mb-0">
                    <CardHeader className="d-flex justify-content-between align-items-center py-2">
                      <span className="fw-medium">{type.name}
                        <Badge color="light" className="text-muted ms-2">{type.displayType}</Badge>
                      </span>
                      <button type="button" className="btn btn-sm btn-soft-danger" onClick={() => p.removeType(type)}>
                        <i className="ri-delete-bin-line" />
                      </button>
                    </CardHeader>
                    <CardBody className="py-2">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {type.options.length === 0 ? (
                          <span className="text-muted fs-13">Seçenek yok</span>
                        ) : type.options.map((o) => (
                          <span key={o.localId} className="badge bg-light text-body border d-flex align-items-center gap-1">
                            {isColor && o.colorHex && (
                              <span style={{ width: 12, height: 12, borderRadius: "50%", background: o.colorHex, display: "inline-block", border: "1px solid #ccc" }} />
                            )}
                            {o.value}
                            <i className="ri-close-line ms-1" style={{ cursor: "pointer" }} onClick={() => p.removeOption(type, o)} />
                          </span>
                        ))}
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <Input bsSize="sm" placeholder="Değer (Siyah, M...)" value={inp.value}
                          onChange={(e) => p.setOptionInputs((prev) => ({ ...prev, [type.localId]: { ...inp, value: e.target.value } }))} />
                        {isColor && (
                          <Input type="color" bsSize="sm" style={{ width: 44, padding: 2 }} value={inp.colorHex}
                            onChange={(e) => p.setOptionInputs((prev) => ({ ...prev, [type.localId]: { ...inp, colorHex: e.target.value } }))} />
                        )}
                        <button type="button" className="btn btn-sm btn-soft-primary" onClick={() => p.addOption(type)}>
                          <i className="ri-add-line" />
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </CardBody>
    </Card>

    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">2. Kombinasyonlar (Fiyat / Stok)</h5></CardHeader>
      <CardBody>
        {p.combos.length === 0 ? (
          <div className="text-muted fs-13">Kombinasyon oluşması için her eksende en az bir seçenek olmalı.</div>
        ) : (
          <div className="table-responsive">
            <Table className="align-middle table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>Kombinasyon</th>
                  <th style={{ width: 120 }}>Fiyat ({p.currencyCode})</th>
                  <th style={{ width: 100 }}>İndirim (%)</th>
                  <th style={{ width: 110 }}>Stok</th>
                  <th style={{ width: 140 }}>SKU</th>
                  <th style={{ width: 90 }}>Durum</th>
                  {p.isEdit && <th style={{ width: 90 }}>Kaydet</th>}
                </tr>
              </thead>
              <tbody>
                {p.combos.map((c) => (
                  <tr key={c.key}>
                    <td className="fw-medium">{c.combination}
                      {c.existingId && <Badge color="success" className="ms-2">kayıtlı</Badge>}
                    </td>
                    <td><Input type="number" bsSize="sm" value={c.price} onChange={(e) => p.updateCombo(c.key, "price", e.target.value)} /></td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <Input type="number" bsSize="sm" min={0} max={100} placeholder="0"
                          value={c.discountPercent} onChange={(e) => p.updateCombo(c.key, "discountPercent", e.target.value)} />
                        {c.discountPercent && c.price && Number(c.discountPercent) > 0 && (
                          <small className="text-success text-nowrap fw-medium">
                            {(Number(c.price) * (1 - Number(c.discountPercent) / 100)).toFixed(2)}
                          </small>
                        )}
                      </div>
                    </td>
                    <td><Input type="number" bsSize="sm" value={c.stock} onChange={(e) => p.updateCombo(c.key, "stock", e.target.value)} /></td>
                    <td><Input bsSize="sm" value={c.sku} onChange={(e) => p.updateCombo(c.key, "sku", e.target.value)} /></td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center">
                        <input className="form-check-input" type="checkbox" role="switch"
                          checked={c.isActive} onChange={(e) => p.updateCombo(c.key, "isActive", e.target.checked)} />
                      </div>
                    </td>
                    {p.isEdit && (
                      <td>
                        <button type="button" className="btn btn-soft-success btn-sm" onClick={() => p.saveCombo(c)}>
                          <i className="ri-save-3-line" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {!p.isEdit && p.combos.length > 0 && (
          <div className="text-muted fs-12 mt-2">
            <i className="ri-information-line me-1" />
            Dolu kombinasyonlar, ürünü kaydettiğinde otomatik oluşturulur.
          </div>
        )}
      </CardBody>
    </Card>
  </>
);