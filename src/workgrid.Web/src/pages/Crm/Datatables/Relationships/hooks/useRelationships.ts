import { Datatable } from "common/data/Datatable";
import { useGetDatatablesRelationships } from "hooks/useDatatables";

export type RelationshipTable = Datatable & {
    isSeen: boolean;
    isOpen: boolean;
    zIndex: number;
    x: number;
    y: number;
};

export interface RelationshipsApi {
    tableList: { [id: number]: RelationshipTable };
    setTableList: React.Dispatch<React.SetStateAction<{ [id: number]: RelationshipTable }>>;
    tablesRelationships: any;
    tablesRelationshipsError: any;
    isTablesRelationshipsLoading: boolean;
}

/**
 * useRelationships — ilişki diyagramı tablolarının konum motoru.
 *
 *  NE YAPAR (özet):
 *  Backend'den gelen tabloları, sürüklenebilir ER-diyagramı kanvasına
 *  yerleştirmek için her birine {x, y, zIndex, isSeen, isOpen} durumu atar.
 *  Daha önce kaydedilmiş konumlar localStorage'dan geri yüklenir; yeni/kayıtsız
 *  tablolar ise ÇAKIŞMASIZ biçimde otomatik konumlandırılır.
 *
 *  - Persist merge: RELATIONSHIP_STORAGE'daki kayıt varsa tablo onunla
 *      birleştirilir; yoksa DEFAULT_POSITIONS taban alınır.
 *  - Çakışma önleme: isOverlapping(x, y, placed) yeni kartı, yerleştirilmiş
 *      kartlara GAP_X/GAP_Y mesafesinden yakınsa reddeder; ızgara üzerinde
 *      (MIN/MAX sınırları içinde) boş hücre bulunana dek y↓ sonra x→ ilerler.
 *  - Sonuç {id: RelationshipTable} sözlüğü olarak state'e yazılır.
 *
 *  Izgara-tabanlı çakışmasız otomatik yerleşim + kalıcı konum birleştirme
 */
export const useRelationships = (): RelationshipsApi => {
  //  Kalıcı konum merge + ızgara-tabanlı çakışmasız otomatik yerleştirme.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};