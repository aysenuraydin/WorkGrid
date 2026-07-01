import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "components/Common/BreadCrumb";
import { useGetBrand } from "hooks/useBrand";

const PrivacyPolicy = () => {
  const { data: brand } = useGetBrand();
  document.title = "Gizlilik Politikası | " + (brand?.companyName || "Workgrid");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Gizlilik Politikası" pageTitle={brand?.companyName || "Workgrid"} />
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card>
                <div className="bg-dark-subtle position-relative">
                  <CardBody className="p-5">
                    <div className="text-center">
                      <h3>Gizlilik Politikası</h3>
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
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <FeatherIcon
                        icon="check-circle"
                        className="text-success icon-dual-success icon-xs"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h5>Workgrid Gizlilik Politikası</h5>
                      <p className="text-muted">
                        workgrid.com adresinden erişilebilen Workgrid bünyesinde, ziyaretçilerimizin gizliliği temel önceliklerimizden biridir. 
                        Bu Gizlilik Politikası belgesi, Workgrid tarafından toplanan ve kaydedilen bilgi türlerini ve bunların nasıl kullanıldığını içermektedir.
                      </p>
                      <p className="text-muted">
                        Ek sorularınız varsa veya Gizlilik Politikamız hakkında daha fazla bilgiye ihtiyaç duyarsanız, support@workgrid.com adresinden bizimle e-posta yoluyla iletişime geçmekten çekinmeyin.
                      </p>
                      <p className="text-muted">
                        Bu gizlilik politikası yalnızca çevrimiçi faaliyetlerimiz için geçerlidir ve web sitemizi ziyaret eden kullanıcıların Workgrid ile paylaştığı ve/veya topladığı bilgiler için geçerlidir. 
                        Bu politika, çevrimdışı olarak veya bu web sitesi dışındaki kanallar aracılığıyla toplanan hiçbir bilgi için geçerli değildir.
                      </p>
                      <p className="text-muted">Bilgilerinizi nasıl kullanıyoruz:</p>
                      <ul className="text-muted">
                        <li>
                          <p>
                            Kullanıcı kimliğini doğrulamak ve yetki atamalarını doğru şekilde yaparak, sistem denetimlerine yetkisiz erişimi engellemek ve güvenli idari çalışma alanlarını sürdürmek.
                          </p>
                        </li>
                        <li>
                          <p>
                            Rol değişikliklerini, yapılandırma ayarlamalarını ve profil kayıtlarını veritabanı katmanlarında güvenli bir şekilde takip ederek, dahili veri yapılarını etkili bir şekilde yönetmek ve düzenlemek.
                          </p>
                        </li>
                        <li>
                          <p>
                            Kullanıcıların platform panosunun farklı bölümlerinde nasıl gezindiğini analiz ederek, sistem yanıt hızını ve genel düzen etkileşimlerini optimize etmek.
                          </p>
                        </li>
                        <li>
                          <p>
                            Sistem kararlılığını izlemek ve teknik operasyonlarımızın sürekli hizmet çalışma süresini korumasına ve beklenmedik performans anormalliklerini gidermesine yardımcı olacak hata günlükleri oluşturmak.
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <FeatherIcon
                        icon="check-circle"
                        className="text-success icon-dual-success icon-xs"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h5>Bilgilerinizi kullanım şeklimiz</h5>
                      <p className="text-muted">
                        Bizimle doğrudan iletişime geçerseniz, adınız, e-posta adresiniz, telefon numaranız, mesajınızın içeriği ve/veya bize gönderebileceğiniz ekler ve sağlamayı seçebileceğiniz diğer bilgiler gibi sizin hakkınızda ek bilgiler alabiliriz.
                      </p>
                      <p className="text-muted">
                        Müşteri hizmetleri de dahil olmak üzere, web sitesi ile ilgili güncellemeleri ve diğer bilgileri size sağlamak ve sistem sağlığı izleme amaçlarıyla doğrudan veya ortaklarımızdan biri aracılığıyla sizinle iletişim kurarız.
                      </p>
                      <p className="text-muted">
                        Bir Hesap için kayıt olduğunuzda, ad, şirket adı, adres, e-posta adresi ve telefon numarası gibi iletişim bilgilerinizi isteyebiliriz.
                      </p>
                      <p className="text-muted">
                        Topladığımız bilgileri çeşitli şekillerde kullanırız, bunlara aşağıdakiler dahildir:
                      </p>
                      <ul className="text-muted vstack gap-2">
                        <li>Web sitemizi sağlamak, işletmek ve sürdürmek</li>
                        <li>Web sitemizi iyileştirmek, kişiselleştirmek ve genişletmek</li>
                        <li>Web sitemizi nasıl kullandığınızı anlamak ve analiz etmek</li>
                        <li>Yeni ürünler, hizmetler, özellikler ve işlevler geliştirmek</li>
                        <li>Size e-posta göndermek</li>
                        <li>Dolandırıcılığı tespit etmek ve önlemek</li>
                      </ul>
                      <p className="text-muted">
                        Her etkileşimli konsol gibi Workgrid de 'çerezler' (cookies) kullanır. Bu çerezler, ziyaretçilerin tercihlerini ve ziyaretçinin eriştiği veya ziyaret ettiği web sitesindeki sayfaları içeren bilgileri depolamak için kullanılır. Bilgiler, ziyaretçilerin tarayıcı türüne ve/veya diğer bilgilere dayalı olarak web sayfası içeriğimizi özelleştirerek kullanıcı deneyimini optimize etmek için kullanılır.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <FeatherIcon
                        icon="check-circle"
                        className="text-success icon-dual-success icon-xs"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-muted">
                        Sitemizdeki bazı entegre altyapı modülleri çerezler ve güvenli kimlik doğrulama belirteçleri kullanabilir. Bağlı sistem hizmetlerimiz operasyonel bütünlüğü sağlar. Her teknik ortağın, veri işleme yöntemlerini belirten kendi Gizlilik Politikası mevcuttur.
                      </p>
                      <p className="text-muted">
                        <b>
                          Workgrid'in Gizlilik Politikası, diğer hizmetler veya bağlı harici araçlar için geçerli değildir. Bu nedenle, daha ayrıntılı bilgi için bu üçüncü taraf sistemlerin ilgili Gizlilik Politikalarına başvurmanızı tavsiye ederiz. 
                          Bu politikalar, belirli seçeneklerden nasıl vazgeçeceğiniz (opt-out) hakkındaki uygulamalarını ve talimatlarını içerebilir. Bu Gizlilik Politikalarının tam listesine ve bağlantılarına güvenlik panelinizden ulaşabilirsiniz.
                        </b>
                      </p>
                    </div>
                  </div>

                  <div className="text-end">
                    <Link to="#!" className="btn btn-danger">
                      Anladım
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

export default PrivacyPolicy;