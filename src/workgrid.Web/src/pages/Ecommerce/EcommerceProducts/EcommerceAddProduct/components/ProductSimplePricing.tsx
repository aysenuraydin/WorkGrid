import { Card, CardBody, CardHeader, Row, Col, Input, Label, FormFeedback } from "reactstrap";

export const ProductSimplePricing = ({ formik, currencyCode }: { formik: any; currencyCode?: string }) => (
  <Card className="border border-2">
    <CardHeader><h5 className="card-title mb-0">Fiyat & Stok Bilgisi</h5></CardHeader>
    <CardBody>
      <Row>
        <Col sm={4}>
          <Label className="form-label" htmlFor="simple-price">Fiyat ({currencyCode})</Label>
          <Input type="number" id="simple-price" name="simplePrice" placeholder="0"
            value={formik.values.simplePrice} onBlur={formik.handleBlur} onChange={formik.handleChange}
            invalid={!!(formik.errors.simplePrice && formik.touched.simplePrice)} />
          {formik.errors.simplePrice && formik.touched.simplePrice ? (
            <FormFeedback type="invalid">{formik.errors.simplePrice}</FormFeedback>
          ) : null}
        </Col>
        <Col sm={4}>
          <Label className="form-label" htmlFor="simple-stock">Stok Adedi</Label>
          <Input type="number" id="simple-stock" name="simpleStock" placeholder="0"
            value={formik.values.simpleStock} onBlur={formik.handleBlur} onChange={formik.handleChange}
            invalid={!!(formik.errors.simpleStock && formik.touched.simpleStock)} />
          {formik.errors.simpleStock && formik.touched.simpleStock ? (
            <FormFeedback type="invalid">{formik.errors.simpleStock}</FormFeedback>
          ) : null}
        </Col>
        <Col sm={4}>
          <Label className="form-label" htmlFor="simple-sku">Stok Kodu (SKU)</Label>
          <Input type="text" id="simple-sku" name="simpleSku" placeholder="opsiyonel"
            value={formik.values.simpleSku} onChange={formik.handleChange} />
        </Col>
      </Row>
    </CardBody>
  </Card>
);