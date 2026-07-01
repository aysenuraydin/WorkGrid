import { RelationshipTable } from "./useRelationships";

/**
 * useRelationshipTables — ilişki kanvasının zoom / pan / görünüm motoru. 
 *  NE YAPAR (özet):
 *  ER-diyagramı kanvasının kendisini (kartları değil) yönetir: yakınlaştırma,
 *  kaydırma (pan), görünüme sığdırma ve görünüm durumunun kalıcılaştırılması.
 *
 *  - Zoom: Ctrl+wheel ile 0.3–2.0 arası ölçek; imleç konumu transform-origin
 *      olarak alınır, böylece imlecin altındaki nokta sabit kalır.
 *  - Pan: boş alanda mouse-down + move ile scrollLeft/scrollTop sürüklenir.
 *  - fitToView: görünür kartların min x/y'sine göre kanvası kaydırıp
 *      içeriği görünür alana getirir.
 *  - Persist: scale/origin/scroll RELATIONSHIP_VIEW_STATE'e yazılır ve açılışta
 *      geri yüklenir; zoom/pan sırasında geçici kontrol göstergesi tetiklenir.
 *  - maxY: görünür kartların (açık/kapalı yüksekliğine göre) alt sınırından
 *      kanvas yüksekliğini türetir.
 *
 *  İmleç-merkezli zoom, rAF ile throttle'lanan pan ve görünüm-durumu kalıcılığı 
 */
export const useRelationshipTables = (_datatables: RelationshipTable[]): any => {
  //  İmleç-merkezli zoom + pan + fit-to-view + görünüm-state persist.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};