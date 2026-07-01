import { Dispatch, SetStateAction } from "react";
import { RelationshipTable } from "./useRelationships";

/**
 * useRelationshipList — sol panel tablo görünürlük + yeniden-konumlama motoru. 
 *  NE YAPAR (özet):
 *  Sol listedeki bir tabloyu kanvasta gösterir/gizler. Bir tablo yeniden
 *  görünür yapılırken konumu kanvas dışında ya da (0,0)'da kalmışsa, onu
 *  görünür kartlarla ÇAKIŞMAYAN en yakın boş ızgara hücresine taşır.
 *
 *  - changeVisible: isSeen'i toggle eder; görünür olurken sınır-dışı/orijin
 *      kontrolü yapıp gerekiyorsa GAP_X/GAP_Y ızgarasında boş yer arar.
 *  - toggleFlush: accordion aç/kapa durumu.
 *  - Persist: her değişiklik RELATIONSHIP_STORAGE'a yazılır.
 *
 *  Sınır-dışı tespiti + çakışmasız yeniden yerleştirme  
 */
export const useRelationshipList = (
  _setTableList: Dispatch<SetStateAction<Record<number, RelationshipTable>>>
): any => {
  //  Görünürlük toggle + sınır-dışı çakışmasız yeniden konumlandırma.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};