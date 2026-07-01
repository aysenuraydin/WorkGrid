import { Card, CardBody, Input, Label, FormFeedback } from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export const ProductBasicInfo = ({ formik }: { formik: any }) => (
  <Card className="border border-2">
    <CardBody>
      <div className="mb-3">
        <Label className="form-label" htmlFor="product-title-input">Ürün Adı</Label>
        <Input type="text" id="product-title-input" placeholder="Ürün adını girin" name="name"
          value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange}
          invalid={!!(formik.errors.name && formik.touched.name)} />
        {formik.errors.name && formik.touched.name ? (
          <FormFeedback type="invalid">{formik.errors.name}</FormFeedback>
        ) : null}
      </div>

      <div className="mb-3">
        <Label className="form-label" htmlFor="product-slug-input">Slug (URL)</Label>
        <Input type="text" id="product-slug-input" placeholder="urun-adi" name="slug"
          value={formik.values.slug} onBlur={formik.handleBlur} onChange={formik.handleChange}
          invalid={!!(formik.errors.slug && formik.touched.slug)} />
        {formik.errors.slug && formik.touched.slug ? (
          <FormFeedback type="invalid">{formik.errors.slug}</FormFeedback>
        ) : null}
        <small className="text-muted">Boş bırakırsan üründen otomatik üretilir.</small>
      </div>

      <div>
        <Label>Ürün Açıklaması</Label>
        <CKEditor editor={ClassicEditor as any} data={formik.values.description}
          onChange={(_e, editor) => formik.setFieldValue("description", editor.getData())} />
      </div>
    </CardBody>
  </Card>
);