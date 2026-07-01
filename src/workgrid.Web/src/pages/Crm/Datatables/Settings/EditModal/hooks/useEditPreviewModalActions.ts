import { IModalDesignExtended } from "../components/EditPreviewModal";

/**
 * useEditPreviewModalActions — görsel modal tasarımcının etkileşim motoru.
 *
 *  NE YAPAR (özet):
 *  Bir tablonun "kayıt ekle/düzenle" modalının yerleşimini fare ile canlı
 *  tasarlamayı sağlar. Her alan (kolon) 12'lik Bootstrap grid'i üzerinde
 *  konumlandırılır, boyutlandırılır, sıralanır veya serbestçe taşınır.
 *
 *  - swapOrder(id, "left"|"right") : alanın order'ını komşusuyla takas eder.
 *  - startResizeLeft / Right       : sol/sağ boşluğu (spaceLeft/spaceRight)
 *      20px = 1 kolon adımıyla, grid sınırları içinde ayarlar.
 *  - startResizeWidth              : alan genişliğini (1–12) sürükleyerek değiştirir.
 *  - startResizeVertical(top|bottom): üst/alt boşluğu 5px adımlarla ayarlar.
 *  - startDrag                     : alanı absolute moda alıp (x,y) ile serbest
 *      taşır, en öne (maxOrder+1) getirir.
 *  - ResetDesign / ResetDesigntoEverything : kaydedilmiş tasarıma ya da
 *      tamamen varsayılana (tam genişlik, sıfır boşluk) döndürür.
 *
 *  Grid-adımlı çok-yönlü resize, serbest sürükleme ve order takası  
 */
export const useEditPreviewModalActions = (
  _setDesignColumns: React.Dispatch<React.SetStateAction<IModalDesignExtended[]>>,
  _tableId: number
): any => {
  //  Grid-adımlı 4-yön resize + serbest drag + order takası + reset.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};