import { Datatable } from "common/data/Datatable";

/**
 * useEditPreviewModalHeight — modal yüksekliğini sürükleyerek ayarlama.
 *  NE YAPAR (özet):
 *  Tasarım modalının yüksekliğini, üst ve alt kenardan fare ile sürükleyerek
 *  canlı ayarlar; açılışta kaydedilmiş yüksekliği ya da ölçülen içerik
 *  yüksekliğini uygular.
 *
 *  - Başlangıç: table.modalHeight > 0 ise onu, yoksa modalBody'nin ölçülen
 *      clientHeight'ini (kısa gecikmeyle) kullanır; modal kapalıyken hesaplamaz.
 *  - changeModalHeightFromTop / FromBottom: mouse sürüklemesinde deltaY'ye göre
 *      yüksekliği 100px alt sınır ve ekranın %90'ı üst sınırıyla günceller.
 *
 *  Çift-kenar sürükle-yeniden-boyutlandırma  
 */
export const useEditPreviewModalHeight = (
  _table: Datatable,
  _modalBodyRef: React.RefObject<HTMLDivElement | null>,
  _modalHeight: number | undefined,
  _setModalHeight: React.Dispatch<React.SetStateAction<number | undefined>>,
  _modal?: boolean
): {
  changeModalHeightFromTop: (e: React.MouseEvent) => void;
  changeModalHeightFromBottom: (e: React.MouseEvent) => void;
} => {
  //  Üst/alt kenardan sürükle-yükseklik + kaydedilmiş/ölçülen yükseklik.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};