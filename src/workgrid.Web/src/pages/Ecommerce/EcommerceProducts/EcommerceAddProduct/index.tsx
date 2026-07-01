import { Col, Container, Row, Card, CardBody, Form } from "reactstrap";
import { ToastContainer } from "react-toastify";
import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import { useGetCommerce } from "hooks/useCommerce";
import useThemeMode from "hooks/useThemeMode";
import { useProductForm } from "./hooks/useProductForm";
import { ProductBasicInfo } from "./components/ProductBasicInfo";
import { ProductGallery } from "./components/ProductGallery";
import { ProductVariants } from "./components/ProductVariants";
import { ProductSimplePricing } from "./components/ProductSimplePricing";
import { ProductExtras } from "./components/ProductExtras";
import { ProductSidebar } from "./components/ProductSidebar";


const EcommerceAddProduct = () => {
  const { data: brand } = useGetBrand();
  const { data: commerce } = useGetCommerce();
  const { isDark } = useThemeMode();

  const f = useProductForm();
  const { formik, isEdit, loadingProduct, navigate } = f;

  document.title = (isEdit ? "Edit Product | " : "Create Product | ") + (brand?.companyName || "Workgrid");

  if (isEdit && loadingProduct) {
    return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
  }

  return (
    <div className="page-content">
      <ToastContainer closeButton={true} limit={3} style={{ marginTop: "100px" }} />
      <Container fluid>
        <BreadCrumb title={isEdit ? "Ürünü Düzenle" : "Ürün Oluştur"} pageTitle={brand?.companyName || "Workgrid"} />

        <Form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); return false; }}>
          <Row>
            <Col lg={8}>
              <ProductBasicInfo formik={formik} />
              <ProductGallery formik={formik} uploading={f.uploading}
                onMainImage={f.handleMainImage} onGallery={f.handleGallery} />

              {!formik.values.hasVariants ? (
                <ProductSimplePricing formik={formik} currencyCode={commerce?.currencyCode} />
              ) : (
                <ProductVariants
                  isEdit={isEdit}
                  currencyCode={commerce?.currencyCode}
                  vTypes={f.vTypes}
                  newTypeName={f.newTypeName} setNewTypeName={f.setNewTypeName}
                  newTypeDisplay={f.newTypeDisplay} setNewTypeDisplay={f.setNewTypeDisplay}
                  optionInputs={f.optionInputs} setOptionInputs={f.setOptionInputs}
                  addType={f.addType} removeType={f.removeType}
                  addOption={f.addOption} removeOption={f.removeOption}
                  combos={f.combos} updateCombo={f.updateCombo} saveCombo={f.saveCombo}
                  variantError={f.variantError}
                />
              )}

              <ProductExtras
                title="Ürün Özellikleri" icon="ri-star-line"
                rows={f.features} placeholder="Örn: 2 yıl garanti..." emptyText="Henüz özellik eklenmedi."
                onAdd={f.addFeatureRow} onUpdate={f.updateFeatureRow} onRemove={f.removeFeatureRow}
              />
              <ProductExtras
                title="Ürün Hizmetleri" icon="ri-service-line"
                rows={f.services} placeholder="Örn: Hızlı teslimat..." emptyText="Henüz hizmet eklenmedi."
                onAdd={f.addServiceRow} onUpdate={f.updateServiceRow} onRemove={f.removeServiceRow}
              />
            </Col>

            <Col lg={4}>
              <ProductSidebar formik={formik} categories={f.categories ?? []} />
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="hstack gap-2 justify-content-end">
                    <button type="button" className={`btn btn-${isDark ? "soft-" : ""}light`}
                      onClick={() => navigate("/products")}>
                      <i className={`ri-close-line fs-16 me-2 text-${isDark ? "light" : "dark"}`}></i>
                      <span className={`text-${isDark ? "light" : "dark"}`}>İptal</span>
                    </button>
                    <button type="submit" className="btn btn-soft-success w-sm" disabled={f.saving || f.uploading}>
                      <i className="ri-save-3-fill fs-16 me-2"></i>
                      {f.saving ? "Kaydediliyor..." : (isEdit ? "Güncelle" : "Kaydet")}
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default EcommerceAddProduct;