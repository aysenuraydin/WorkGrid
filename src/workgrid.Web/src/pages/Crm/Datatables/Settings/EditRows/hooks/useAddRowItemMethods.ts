import { FileData } from "components/Common/interfaces/TableRowContextType";

/**
 * useAddRowItemMethods — yeni satır dosya durumunun ref köprüsü.
 *
 *  NE YAPAR (özet):
 *  Yeni satır formundaki dosya seçim/silme/yükleme durumunu merkezi ref
 *  (fileDataRef) üzerinde günceller ve gerektiğinde yeniden render tetikler
 *  (durum ref'te tutulduğu için state değil, manuel force-update ile).
 *
 *  - setSelectedFile / setSelectedForDeletion / setLoading: updater'ı ref'in
 *      ilgili bölümüne uygular, ardından bileşeni bir kez yeniden çizer.
 *
 *  Ref-tabanlı dosya durumu + kontrollü yeniden render  
 */
export const useAddRowItemMethods = (_fileDataRef: React.MutableRefObject<FileData>): {
  setSelectedFile: (updater: any) => void;
  setSelectedForDeletion: (updater: any) => void;
  setLoading: (updater: any) => void;
} => {
  //  Ref-tabanlı dosya durumu güncelleme + kontrollü force-update.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};