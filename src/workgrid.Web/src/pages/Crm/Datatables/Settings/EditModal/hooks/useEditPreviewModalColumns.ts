import { TableColumn } from "common/data/TableColumn";
import { IModalDesignExtended } from "../components/EditPreviewModal";

/**
 * useEditPreviewModalColumns — tasarım kolonları ile veri kolonları senkronu.
 *
 *  NE YAPAR (özet):
 *  Modal tasarımcının iki ayrı temsilini birbirine bağlar: (a) sürüklenip
 *  boyutlandırılan hafif "designColumns" listesi ve (b) gerçek girdi
 *  önizlemesi için gereken tam "columns" (TableColumn) listesi.
 *
 *  - İlk yükleme: server kolonlarından modalDesignFk (order/boşluklar/width/
 *      x/y/isMove/isVisible) okunarak designColumns kurulur; ham columns da set edilir.
 *  - Geri yazım: designColumns her değiştiğinde, karşılık gelen TableColumn'ların
 *      modalDesignFk'i güncellenip columns'a yansıtılır (önizleme senkron kalsın).
 *  - min/max order türetimi (uç alanlarda sıralama oklarını gizlemek için).
 *
 *  İki temsili tutarlı tutan çift yönlü senkron bu dosyanın özgün mantığıdır;
 *  gizlenmiştir.
 *
 * Kaynak kodu talep üzerine paylaşılabilir.
 * Source available on request.
 */
export const useEditPreviewModalColumns = (
  _id: number,
  _setDesignColumns: React.Dispatch<React.SetStateAction<IModalDesignExtended[]>>,
  _setColumns: React.Dispatch<React.SetStateAction<TableColumn[]>>,
  _designColumns: IModalDesignExtended[] | undefined
): { minOrder: number; maxOrder: number } => {
  //  designColumns ↔ columns çift yönlü senkron + modalDesignFk merge.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};