import BreadCrumb from "components/Common/BreadCrumb"; 
import { useGetBrand } from "hooks/useBrand";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const TermsCondition = () => { 
  const { data:brand } = useGetBrand();
  document.title = "Kullanım Koşulları | " +(brand?.companyName || "Workgrid");
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Kullanım Koşulları" pageTitle={brand?.companyName || "Workgrid"} />
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card>
                <div className="bg-dark-subtle position-relative">
                  <CardBody className="card-body p-5">
                    <div className="text-center">
                      <h3>Kullanım Koşulları</h3>
                      <p className="mb-0 text-muted">
                        Son güncelleme: 19 Mayıs 2026
                      </p>
                    </div>
                  </CardBody>
                  <div className="shape">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1440" height="60" preserveAspectRatio="none" viewBox="0 0 1440 60">
                      <g mask="url(&quot;#SvgjsMask1001&quot;)" fill="none">
                        <path d="M 0,4 C 144,13 432,48 720,49 C 1008,50 1296,17 1440,9L1440 60L0 60z" style={{ fill: "var(--vz-secondary-bg)" }}></path>
                      </g>
                      <defs>
                        <mask id="SvgjsMask1001">
                          <rect width="1440" height="60" fill="#ffffff"></rect>
                        </mask>
                      </defs>
                    </svg>
                  </div>
                </div>
                <CardBody className="p-4">
                  <div>
                    <h5>Workgrid'e Hoş Geldiniz!</h5>
                    <p className="text-muted">
                      Bu şartlar ve koşullar, workgrid.com adresinde bulunan Workgrid web sitesinin kullanımına ilişkin kuralları ve düzenlemeleri ana hatlarıyla belirtir.
                    </p>
                    <p className="text-muted">
                      Bu web sitesine erişerek, bu şartlar ve koşulları kabul ettiğinizi varsayıyoruz. Bu sayfada belirtilen tüm şart ve koşulları kabul etmiyorsanız Workgrid kullanmaya devam etmeyin.
                    </p>
                    <p className="text-muted">
                      Çoğu etkileşimli web sitesi, her ziyaret için kullanıcının ayrıntılarını almamıza olanak tanıyan çerezleri kullanır. Çerezler, web sitemizin belirli alanlarının işlevselliğini etkinleştirmek ve kullanıcılarımızın web sitemizi ziyaretini kolaylaştırmak amacıyla kullanılmaktadır. Bazı iş ortaklarımız/reklam ortaklarımız da çerez kullanabilir.
                    </p>
                  </div>

                  <div>
                    <h5>Lisans</h5>
                    <p className="text-muted">
                      Aksi belirtilmedikçe, Workgrid ve/veya lisans verenleri, Workgrid üzerindeki tüm materyallerin fikri mülkiyet haklarına sahiptir. Tüm fikri mülkiyet hakları saklıdır. Bu şartlar ve koşullarda belirlenen kısıtlamalara tabi olarak, kişisel kullanımınız için Workgrid üzerinden bu materyallere erişebilirsiniz.
                    </p>
                    <p className="text-muted">Aşağıdakileri yapmamalısınız:</p>
                    <ul className="text-muted vstack gap-2">
                      <li>Workgrid materyallerini yeniden yayımlamak</li>
                      <li>Workgrid materyallerini satmak, kiralamak veya alt lisanslamak</li>
                      <li>Workgrid materyallerini çoğaltmak, kopyalamak veya kopyasını çıkarmak</li>
                      <li>Workgrid içeriklerini yeniden dağıtmak</li>
                    </ul>
                    <p className="text-muted">
                      Bu Sözleşme, düzenlendiği tarih itibarıyla başlar.
                    </p>
                    <p className="text-muted">
                      Web sitemizin bazı bölümleri, kullanıcılara web sitesinin belirli alanlarında görüş ve bilgi paylaşma fırsatı sunar. Workgrid, yorumları web sitesinde yayınlanmadan önce filtrelemez, düzenlemez, yayımlamaz veya gözden geçirmez. Yorumlar, Workgrid'in, temsilcilerinin ve/veya iştiraklerinin görüş ve düşüncelerini yansıtmaz.
                    </p>
                  </div>

                  <div>
                    <p className="text-muted">
                      Workgrid, tüm Yorumları izleme ve uygunsuz, saldırgan bulunan veya bu Şart ve Koşulların ihlaline neden olan Yorumları kaldırma hakkını saklı tutar.
                    </p>
                    <p className="text-muted">
                      Aşağıdakileri garanti ve beyan edersiniz:
                    </p>
                    <ul className="text-muted vstack gap-2">
                      <li>
                        Yorumları web sitemizde paylaşmaya yetkili olduğunuzu ve bunun için gerekli tüm lisanslara ve izinlere sahip olduğunuzu;
                      </li>
                      <li>
                        Yorumların, üçüncü bir tarafın telif hakkı, patent veya ticari marka dahil ancak bunlarla sınırlı olmamak üzere herhangi bir fikri mülkiyet hakkını ihlal etmediğini;
                      </li>
                      <li>
                        Yorumların karalayıcı, iftira niteliğinde, saldırgan, müstehcen veya gizliliği ihlal eden herhangi bir yasa dışı materyal içermediğini;
                      </li>
                      <li>
                        Yorumların ticari veya özel faaliyetleri teşvik etmek ya da yasa dışı etkinlikleri özendirmek için kullanılmayacağını.
                      </li>
                    </ul>
                    <p className="text-muted">
                      İşbu belgeyle Workgrid'e, Yorumlarınızdan herhangi birini her türlü biçimde, formatta veya ortamda kullanma, çoğaltma, düzenleme ve başkalarının kullanması, çoğaltması ve düzenlemesi için yetkilendirme konusunda münhasır olmayan bir lisans verirsiniz.
                    </p>
                    <p className="text-muted">
                      Onaylanmış kuruluşlar, Web sitemize aşağıdaki şekilde köprü (hyperlink) ekleyebilirler:
                    </p>
                    <ul className="text-muted vstack gap-2">
                      <li>Kurumsal adımızın kullanımı yoluyla; veya</li>
                      <li>Bağlantı verilen tekdüzen kaynak konum belirleyicinin (URL) kullanımı yoluyla; veya</li>
                      <li>Bağlantı veren tarafın sitesindeki içeriğin bağlamı ve formatı dahilinde anlamlı olan Web sitemizin başka herhangi bir açıklamasının kullanımı yoluyla.</li>
                    </ul>
                    <p className="text-muted fw-semibold">
                      Bir ticari marka lisans sözleşmesi olmaksızın, Workgrid logosunun veya diğer görsellerinin bağlantı oluşturmak amacıyla kullanılmasına izin verilmeyecektir.
                    </p>
                  </div>

                  <div className="text-end hstack gap-2 justify-content-end">
                    <Link to="#" className="btn btn-primary me-1">
                      Kabul Et
                    </Link>
                    <Link to="#" className="btn btn-outline-danger">
                      <i className="ri-close-line align-bottom me-1"></i>{" "}
                      Reddet
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TermsCondition;