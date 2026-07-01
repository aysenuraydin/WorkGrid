import { DataType } from "common/enums/DataType";

/**
 * useCols — tekil tablo sayfasının dinamik TanStack kolon üreticisi.
 *
 *  NE YAPAR (özet):
 *  Tablonun görünür kolonlarından TanStack Table kolon tanımlarını üretir:
 *  seçim kutusu, satır id, her veri kolonu için tip-duyarlı başlık/hücre ve
 *  satır aksiyonları.
 *
 *  - DynamicHeader: kolonun dataFk/uiFk özniteliklerini ICellConfigs'e indirger,
 *      useCellLogic ile hesaplanan etiketi (yoksa kolon adını) gösterir.
 *  - DynamicCell: hücre değerini güvenli kolon anahtarından okur; AYNA (mirror)
 *      kolon boşsa (realColumnId+realTableId dolu) aynı ilişkinin bağ kolonundaki
 *      değere düşer (fallback); ListItem ile tipe uygun render eder ve
 *      data-col-id ile kolon-scoped stil/JS hedefi işaretler.
 *  - Görünür kolonlar tableOrder'a göre sıralanır; aksiyon kolonu satır
 *      görüntüle/düzenle/sil sağlar.
 *
 *  Ayna-kolon fallback'i ve öznitelik-güdümlü dinamik başlık/hücre üretimi 
 */
export const useCols = (
  _checkedAll: () => void,
  _handleClick: (arg: any, type: DataType) => void,
  _deleteCheckbox: () => void,
  _id: number
): { cols: any[] } => {
  //  Dinamik TanStack kolon üretimi + ayna-kolon fallback + tip-duyarlı hücre.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};