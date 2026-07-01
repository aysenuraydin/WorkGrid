import { FileData } from "components/Common/interfaces/TableRowContextType";
import { UpdateItem } from "pages/Datatables/components/Datatables";
import { MutableRefObject } from "react";

/**
 * useMemoizedCell — tek hücrenin dosya/pending köprüsü.
 *
 *  NE YAPAR (özet):
 *  Memoize edilmiş bir hücre için yerel dosya/yükleme/silme durumunu, merkezi
 *  ref defterleriyle (fileDataRef) senkron tutar ve değer değişimini hem
 *  pending güncelleme defterine hem forma yansıtır.
 *
 *  - localFiles/localLoading/localDeletions: hücre-anahtarına (mapKey) göre
 *      merkezi ref'ten başlatılır; her set işlemi hem yerel state'i hem ref'i günceller.
 *  - onValueChange: yeni değeri pendingUpdatesRef[cellId]'e yazar, sonra üst
 *      handleChange'i çağırır (memoization bozulmadan kayıt izi tutulur).
 *
 *  Yerel state ↔ merkezi ref eşzamanlaması  
 */
export const useMemoizedCell = (
  _mapKey: string,
  _fileDataRef: MutableRefObject<FileData>,
  _pendingUpdatesRef: MutableRefObject<{ [cellId: number]: UpdateItem } | undefined>,
  _handleChange: any,
  _cellId: number
): any => {
  //  Hücre-izole yerel state ↔ merkezi ref senkronu + pending köprüsü.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};