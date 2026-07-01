interface CellProps { val: string; colClass: string; }

/**
 * FileCell — virgülle ayrılmış dosya listesini önizlemeli gösterir. 
 *  NE YAPAR (özet):
 *  Her dosya için uzantıya göre ikon (pdf/görsel/diğer) seçer; görsellerde
 *  tıklanınca satır-içi (lightbox) önizleme açar, diğer dosyalarda blob
 *  indirip yeni sekmede açar. Dosya adı kısaltılarak listelenir.
 *
 *  Uzantı-duyarlı önizleme/indirme mantığı gizlenmiştir. 
 */
export const FileCell = (_props: CellProps): JSX.Element => {
  throw new Error("Source available on request.");
};
