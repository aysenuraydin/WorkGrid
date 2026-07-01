import { Dispatch, SetStateAction } from "react";
import { RelationshipTable } from "./useRelationships";

/**
 * useRelationshipTablesItem — tek bir diyagram kartının sürükleme motoru.
 *
 *  NE YAPAR (özet):
 *  Kanvastaki tek bir tablo kartının konumlandırılmasını, sürüklenmesini ve
 *  üste getirilmesini (z-index) yönetir; her değişikliği localStorage'a yazar.
 *
 *  - Drag: yalnızca kart başlığından (.card-header) tutunca başlar; mouse-move
 *      ile x/y güncellenir (negatif konumlar kırpılır), rAF ile throttle edilir.
 *  - z-index: sürükleme başında normalizeZIndexes tüm kartların z değerlerini
 *      tabana çeker, ardından tutulan kart maxZ+1 ile en öne alınır.
 *  - Drag vs click ayrımı: movedRef ile 3px eşiğini aşan hareket "sürükleme"
 *      sayılır; aşmayan tık ise kartın aç/kapa (isOpen) toggle'ını çalıştırır.
 *  - Persist: her drag/toggle sonrası kartların {id,isSeen,isOpen,zIndex,x,y}
 *      özeti RELATIONSHIP_STORAGE'a yazılır.
 *
 *  Başlıktan-tutmalı drag, z-index normalizasyonu ve hareket-eşikli
 *  drag/click ayrımı  
 */
export const useRelationshipTablesItem = (
  _setTableList: Dispatch<SetStateAction<Record<number, RelationshipTable>>>,
  _table: RelationshipTable
): any => {
  //  Başlıktan-tutmalı drag + z-index normalizasyonu + drag/click ayrımı.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};