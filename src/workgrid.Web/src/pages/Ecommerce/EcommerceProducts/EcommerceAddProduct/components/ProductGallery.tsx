import { Card, CardBody, CardHeader, Row, Col, Input, Label } from "reactstrap";
import Dropzone from "react-dropzone";
import { Image } from "antd";
import config from "config";
import useThemeMode from "hooks/useThemeMode";

const resolveImg = (name?: string | null) =>
  !name ? "" : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

interface Props {
  formik: any;
  uploading: boolean;
  onMainImage: (e: any) => void;
  onGallery: (files: File[]) => void;
}

export const ProductGallery = ({ formik, uploading, onMainImage, onGallery }: Props) => {
  const { isDark } = useThemeMode();
  const dummy = "https://dummyimage.com/300x300/" + (isDark ? "000" : "F3F6F9") + "/" + (isDark ? "fff" : "969696");
  const mainImage = formik.values.mainImage;
  const gallery: string[] = formik.values.gallery ?? [];
  const imageError = formik.errors.mainImage && formik.touched.mainImage;

  return (
    <Card className="border border-2">
      <CardHeader><h5 className="card-title mb-0">Ürün Galerisi</h5></CardHeader>
      <CardBody>
        <div className="mb-4">
          <h5 className="fs-14 mb-1">Ürün Ana Görseli</h5>
          <p className="text-muted">Ürün ana görselini ekleyin.</p>
          <div className="text-center">
            <div className="position-relative d-inline-block">
              <div className="position-absolute top-100 start-100 translate-middle">
                <Label htmlFor="main-image-input" className="mb-0" title="Görsel Seç">
                  <div className="avatar-xs cursor-pointer">
                    <div className="avatar-title bg-light border rounded-circle text-muted" style={{ width: "40px", height: "40px" }}>
                      <i className="ri-image-fill" style={{ fontSize: "20px" }}></i>
                    </div>
                  </div>
                </Label>
                <Input className="form-control d-none" id="main-image-input" type="file"
                  accept="image/png, image/gif, image/jpeg" onChange={onMainImage} />
              </div>
              <div className="avatar-lg" style={{ width: "300px", height: "300px" }}>
                <div className="avatar-title bg-light rounded">
                  <Image src={resolveImg(mainImage)} preview={false} className="avatar-md h-auto" alt="basic"
                    onError={(e) => { e.currentTarget.src = dummy; e.currentTarget.onerror = null; }} />
                </div>
              </div>
            </div>
            {uploading && <div className="text-muted mt-2 fs-13">Yükleniyor...</div>}
            {imageError ? <div className="text-danger fs-13 mt-2">{formik.errors.mainImage}</div> : null}
          </div>
        </div>

        <div>
          <h5 className="fs-14 mb-1">Ürün Galerisi</h5>
          <p className="text-muted">Galeri görsellerini ekleyin.</p>
          <Dropzone onDrop={(accepted) => onGallery(accepted)}>
            {({ getRootProps, getInputProps }) => (
              <div className="dropzone dz-clickable">
                <div className="dz-message needsclick" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="mb-3 mt-5"><i className="display-4 text-muted ri-upload-cloud-2-fill" /></div>
                  <h5>Dosyaları buraya bırakın veya tıklayın.</h5>
                </div>
              </div>
            )}
          </Dropzone>
          <div className="list-unstyled mb-0 mt-2">
            {gallery.map((name, i) => (
              <Card className="mt-1 mb-0 shadow-none border" key={i}>
                <div className="p-2">
                  <Row className="align-items-center">
                    <Col className="col-auto">
                      <Image height={60} src={resolveImg(name)} className="avatar-sm rounded bg-light" alt={name}
                        onError={(e) => { e.currentTarget.src = dummy; e.currentTarget.onerror = null; }} />
                    </Col>
                    <Col><span className="text-muted">{name}</span></Col>
                    <Col className="col-auto">
                      <button type="button" className="btn btn-sm btn-soft-danger"
                        onClick={() => formik.setFieldValue("gallery", gallery.filter((_, idx) => idx !== i))}>
                        <i className="ri-delete-bin-line" />
                      </button>
                    </Col>
                  </Row>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};