import { TableColumn } from "common/data/TableColumn";
import { TableCell } from "common/data/TableCell";
import { Datatable } from "common/data/Datatable";

/**
 * useForeignRows — ilişkili tablo satırlarını etiket çözümü için süzer.
 *
 *  NE YAPAR (özet):
 *  Bir tablonun foreign (ilişkili) kolonları için, hedef tabloların satır
 *  hücrelerinden yalnızca gereken kolonları süzüp rowId → TableCell[] sözlüğü
 *  olarak biriktirir. Böylece bir ilişki değeri (rowId) yerine insan-okunur
 *  etiket gösterilebilir.
 *
 *  - foreignColIds: realTableId dolu kolonların realColumnId'leri.
 *  - Hedef tabloların her satırındaki cellsFk, bu kolon id'lerine göre süzülür;
 *      dolu sonuç rowId anahtarıyla saklanır.
 *
 *  İlişkili etiket çözümü için seçici hücre süzme  
 */
export const useForeignRows = (
  _columns: TableColumn[],
  _tableAndRows: Datatable[] | null | undefined
): { [rowId: number]: TableCell[] } => {
  //  Foreign kolon hücrelerini etiket çözümü için süzme.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};