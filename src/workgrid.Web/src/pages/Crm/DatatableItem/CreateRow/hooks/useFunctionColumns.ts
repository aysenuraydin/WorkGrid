import { TableColumn } from "common/data/TableColumn";
import { FormValues } from "components/Common/interfaces/TableRowContextType";

/**
 * useFunctionColumns — oluştur/düzenle formunda hesaplanan alan motoru.
 *
 *  NE YAPAR (özet):
 *  functionText tanımlı kolonlar için, formüldeki {{kolonId}} referanslarını o
 *  satırın güncel değerleriyle değiştirip güvenli biçimde değerlendirir ve
 *  sonucu ilgili hücreye yazar (değer değiştikçe otomatik yeniden hesaplanır).
 *
 *  - Referanslar çözülürken boş/null "0"a, boolean "1"/"0"a, obje "0"a normalize
 *      edilir; sonuç yalnızca gerçekten değiştiyse forma yazılır (döngü önlenir).
 *
 *  {{id}} referans çözümü + otomatik yeniden hesaplama  
 */
export const useFunctionColumns = (
  _formikValues: FormValues,
  _columns: TableColumn[],
  _setFieldValue: (field: string, value: any) => void
): void => {
  //  Hesaplanan-alan {{id}} formül değerlendirme + otomatik yeniden hesaplama.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};