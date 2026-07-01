interface CellProps { val: string; colClass: string; isIcon: boolean; }

/**
 * VideoCell — virgülle ayrılmış video/dosya listesini oynatıcı + eklerle gösterir. 
 *  NE YAPAR (özet):
 *  İlk öğe gömülü video oynatıcı olarak gösterilir; kalan öğeler tıklanınca
 *  görselse satır-içi önizleme açar, değilse blob indirip yeni sekmede açar.
 *  Uzantı-duyarlı oynatma/önizleme mantığı gizlenmiştir.  
 */
export const VideoCell = (_props: CellProps): JSX.Element => {
  throw new Error("Source available on request.");
};
