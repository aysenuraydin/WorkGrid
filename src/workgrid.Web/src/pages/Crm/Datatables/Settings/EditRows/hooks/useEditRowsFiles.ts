import { TableColumn } from "common/data/TableColumn";

/**
 * useEditRowsFiles — satır düzenleyicinin dosya yükleme/silme motoru.
 *
 *  NE YAPAR (özet):
 *  Dosya/görsel/video tipindeki hücreler için, satır kaydedilirken dosyaları
 *  yükleyip son değeri hesaplar ve silinecekleri temizler. Dosya durumu
 *  hücre-anahtarlı (cells.{rowId}.{colId}) ref'lerde tutulur (render tetiklemez).
 *
 *  - fileColIds: File/DropFiles/Video/Image kolonlarının id'leri.
 *  - uploadAllFiles(rowId): her dosya kolonu için önce FileManager ref'inin
 *      upload'ı denenir; yoksa staged dosyalar doğrudan yüklenir; yüklenen
 *      isimler virgülle birleştirilir.
 *  - deletePendingFiles: silmeye işaretlenmiş dosyaları tek tek siler.
 *  - buildFinalFileValue: orijinal - silinen + yeni yüklenen birleşimini
 *      üretir (çok dosyalı alanların nihai değeri).
 *
 *  Çok-dosya upload/sil/birleştir akışı ve ref-tabanlı dosya durumu  
 */
export const useEditRowsFiles = (_columns: TableColumn[]): any => {
  //  Çok-dosya upload/sil/merge + ref-tabanlı hücre dosya durumu.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};