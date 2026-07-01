import { MenuItem } from "common/data/menuItem";

/**
 * useBuildNestedMenu — düz menü listesini çok seviyeli ağaca dönüştürür.
 *
 *  NE YAPAR (özet):
 *  Backend'den gelen flat MenuItem[] dizisini, parentId ilişkilerine göre
 *  sınırsız derinlikte iç içe (nested) bir menü ağacına çevirir. Her düğüme
 *  aç/kapa (collapse) durumu ve tıklama davranışı bağlar.
 *
 *  - Kök tespiti:   parentId null OLAN ya da parentId'si listede BULUNMAYAN
 *                   öğeler kök kabul edilir (kırık referanslı "orphan"lar da
 *                   köke terfi ettirilir, isOrphan bayrağıyla işaretlenir).
 *  - Recursive iniş: addChildren() her düğüm için parentId eşleşen çocukları
 *                   toplar, children dizisine yazar ve bir alt seviyeye iner.
 *  - collapse state: openMenus sözlüğünden her düğümün açık/kapalı durumu
 *                   okunur; click handler setOpenMenus ile toggle eder.
 *  - Sıralama:      header olmayan parent'lar + header'lar order alanına göre
 *                   birleştirilip sıralanır (order yoksa sona atılır).
 *
 *  Kırık parentId'li ağaçlarda bile çökmeyen orphan-terfi mantığı ve
 *  seviye-bağımsız recursive kurulum  
 */
export const useBuildNestedMenu = (
  menuItemList: MenuItem[],
  openMenus: any,
  setOpenMenus: any
): any[] => {
  //  Flat → nested ağaç kurucu (orphan-terfi + recursive iniş + order sort).
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};