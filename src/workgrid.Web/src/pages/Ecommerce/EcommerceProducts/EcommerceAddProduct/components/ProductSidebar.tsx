import { Card, CardBody, CardHeader, Input, Label, FormFeedback } from "reactstrap";
import Flatpickr from "react-flatpickr";

interface Props {
  formik: any;
  categories: any[];
}

export const ProductSidebar = ({ formik, categories }: Props) => (
  <>
    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">Ürün Tipi</h5></CardHeader>
      <CardBody>
        <div className="form-check form-switch form-switch-md">
          <input className="form-check-input" type="checkbox" role="switch" id="hasVariants-switch"
            checked={formik.values.hasVariants}
            onChange={(e) => formik.setFieldValue("hasVariants", e.target.checked)} />
          <Label className="form-check-label" htmlFor="hasVariants-switch">
            Bu ürünün varyantları var (renk, beden vb.)
          </Label>
        </div>
        <p className="text-muted fs-13 mt-2 mb-0">
          {formik.values.hasVariants ? "Fiyat ve stok, kombinasyonlardan girilir." : "Tek fiyat ve stok. Soldan girin."}
        </p>
      </CardBody>
    </Card>

    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">Yayınlama</h5></CardHeader>
      <CardBody>
        <div className="mb-3">
          <Label htmlFor="status-input" className="form-label">Durum</Label>
          <Input name="status" type="select" className="form-select" id="status-input"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.status}>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
            <option value="scheduled">Planlanmış</option>
          </Input>
        </div>
        <div>
          <Label htmlFor="visibility-input" className="form-label">Görünürlük</Label>
          <Input name="visibility" type="select" className="form-select" id="visibility-input"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.visibility}>
            <option value="public">Herkes</option>
            <option value="hidden">Gizli</option>
          </Input>
        </div>
      </CardBody>
    </Card>

    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">Yayın Takvimi</h5></CardHeader>
      <CardBody>
        <Label htmlFor="publishedDate-field" className="form-label">Yayın Tarihi</Label>
        <Flatpickr name="publishedDate" id="publishedDate-field" className="form-control"
          placeholder="Tarih seçin" options={{ dateFormat: "Y-m-d" }}
          value={formik.values.publishedDate || ""}
          onChange={(dates: any) => {
            const d = dates?.[0];
            formik.setFieldValue("publishedDate",
              d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "");
          }} />
      </CardBody>
    </Card>

    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">Ürün Kategorisi</h5></CardHeader>
      <CardBody>
        <Input name="wGProductCategoryId" type="select" className="form-select" id="category-field"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.wGProductCategoryId}
          invalid={!!(formik.errors.wGProductCategoryId && formik.touched.wGProductCategoryId)}>
          <option value="">Kategori seçin</option>
          {(categories ?? []).map((cat: any) => (
            <option value={cat.id} key={cat.id}>{cat.name}</option>
          ))}
        </Input>
        {formik.errors.wGProductCategoryId && formik.touched.wGProductCategoryId ? (
          <FormFeedback type="invalid" className="d-block">{formik.errors.wGProductCategoryId}</FormFeedback>
        ) : null}
      </CardBody>
    </Card>

    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">Ürün Etiketleri</h5></CardHeader>
      <CardBody>
        <Input className="form-control" placeholder="Etiket girin (virgülle ayır)" type="text" name="tags"
          value={formik.values.tags} onBlur={formik.handleBlur} onChange={formik.handleChange} />
      </CardBody>
    </Card>

    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">Kısa Açıklama</h5></CardHeader>
      <CardBody>
        <textarea
          className={`form-control ${formik.errors.shortDescription && formik.touched.shortDescription ? "is-invalid" : ""}`}
          placeholder="Kısa açıklama..." rows={3} name="shortDescription"
          value={formik.values.shortDescription} onBlur={formik.handleBlur} onChange={formik.handleChange} />
        {formik.errors.shortDescription && formik.touched.shortDescription ? (
          <div className="invalid-feedback d-block">{formik.errors.shortDescription}</div>
        ) : null}
      </CardBody>
    </Card>

    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">Genel Bilgiler</h5></CardHeader>
      <CardBody>
        <div className="mb-3">
          <Label className="form-label" htmlFor="manufacturer-input">Üretici Adı</Label>
          <Input type="text" id="manufacturer-input" name="manufacturer" placeholder="Üretici adını girin"
            value={formik.values.manufacturer} onBlur={formik.handleBlur} onChange={formik.handleChange} />
        </div>
        <div>
          <Label className="form-label" htmlFor="brand-input">Marka</Label>
          <Input type="text" id="brand-input" name="brand" placeholder="Marka adını girin"
            value={formik.values.brand} onBlur={formik.handleBlur} onChange={formik.handleChange}
            invalid={!!(formik.errors.brand && formik.touched.brand)} />
          {formik.errors.brand && formik.touched.brand ? (
            <FormFeedback type="invalid">{formik.errors.brand}</FormFeedback>
          ) : null}
        </div>
      </CardBody>
    </Card>
  </>
);