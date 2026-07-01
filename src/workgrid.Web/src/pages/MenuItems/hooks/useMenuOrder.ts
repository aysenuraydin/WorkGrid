import { MenuItem } from "common/data/menuItem";

export interface MenuOrderApi {
  isMove: { [key: string]: { active: boolean; initialOrder: number } };
  setIsMove: React.Dispatch<
    React.SetStateAction<{ [key: string]: { active: boolean; initialOrder: number } }>
  >;
  moveUp: (id: number) => void;
  moveDown: (id: number) => void;
  resetOrder: (id: number, initialOrder: number) => void;
}

/**
 * useMenuOrder — menü öğelerinin kardeş-grup içi sıralama motoru.
 *
 *  NE YAPAR (özet):
 *  Bir menü öğesini, YALNIZCA aynı ebeveyne (parentId) sahip kardeşleri
 *  arasında yukarı/aşağı taşır ve iptal edildiğinde başlangıç sırasına
 *  geri döndürür. Sıralama optimistic'tir: local liste anında güncellenir,
 *  onay ayrı bir mutation ile backend'e yazılır.
 *
 *  - moveUp / moveDown: hedefin kardeş grubunu order'a göre sıralar,
 *      komşuyla order değerlerini takas eder (sınırdaysa no-op).
 *  - resetOrder: taşıma iptalinde öğeyi initialOrder'a alır, ardından
 *      grubu yeniden 1..n olacak şekilde sıkıştırıp tutarlı hale getirir
 *      ve isMove kaydını kapatır.
 *  - isMove: her öğe için { active, initialOrder } taşıma oturumu tutar.
 *
 *  Grup-izole takas + iptal sonrası yeniden indeksleme
 */
export const useMenuOrder = (
  menuItemList: MenuItem[],
  setDatamenuItems: any
): MenuOrderApi => {
  //  Kardeş-grup içi order takası + iptalde yeniden indeksleme motoru.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};