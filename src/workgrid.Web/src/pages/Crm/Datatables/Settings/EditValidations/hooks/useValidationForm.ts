import { RulesValidationConfig } from "common/config/RulesValidationConfig";
import { ValidationRuleEnum } from "common/enums/ValidationRuleEnum";
import { TableColumn } from "common/data/TableColumn";
import { Datatable } from "common/data/Datatable";

interface IValidationColumnForm {
  id: number;
  validationFk: {
    type: string;
    rules: RulesValidationConfig[];
    newRule: RulesValidationConfig & { isActive: boolean };
  };
}

interface IValidationFormValues {
  columns: IValidationColumnForm[];
}

/**
 * useValidationForm — kolon başına doğrulama (validation) kuralı editörü.
 *
 *  NE YAPAR (özet):
 *  Her kolona, tipine uygun doğrulama kuralları (required, min/max, length,
 *  matches, unique, integer/positive...) tanımlamayı ve toplu kaydetmeyi
 *  yönetir. Kurallar hem düzenlenir hem de otomatik hata mesajı üretir.
 *
 *  - Başlangıç: her kolon için getValitationType(type) ile doğrulama tipi ve
 *      getInitialRules(col) ile mevcut kurallar formlanır; boş bir "newRule"
 *      eklenir.
 *  - Otomatik mesaj: kural veya değeri değiştikçe, RULE_CONFIG'e (hasValue/
 *      hasMessage) ve DEFAULT_RULE_MESSAGES'a bakılarak kolon adı + değer ile
 *      insan-okunur hata mesajı üretilir; değer taşımayan kurallarda value boşaltılır.
 *  - handleRuleChange / handleValueChange: kural veya değer değişince mesajı
 *      senkron günceller ve changedMap'i işaretler.
 *  - Kaydetme: kurallar { rule, isActive, value, message } biçiminde bulk
 *      validation mutation'ına gönderilir.
 *
 *  Kolon-tipine göre kural türetimi ve config-tabanlı otomatik mesaj üretimi 
 */
export const useValidationForm = (
  _table: Datatable
): {
  columns: TableColumn[];
  formik: any;
  changedMap: { [key: string]: boolean };
  handleRuleChange: (colName: string, names: string, value: string) => void;
  setChangedMap: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  handleValueChange: (colName: string, names: string, newValue: string) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
} => {
  //  Kolon-tipine göre kural türetimi + config-tabanlı otomatik mesaj üretimi.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};