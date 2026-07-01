import { DataType } from 'common/enums/DataType';

/**
 * ViewImage — çok-görselli önizleme galerisi (Swiper).
 *
 *  NE YAPAR (özet):
 *  Virgülle ayrılmış görselleri ana Swiper + küçük-resim (thumbs) galerisi
 *  olarak gösterir; liste/ikon/normal modlarına göre boyutlanır; görsel
 *  yüklenemezse yer-tutucuya düşer. Liste hücresi (ListItem/ImageCell) ve
 *  giriş (RenderCellInput) tarafından ortak kullanılır.
 *
 *  Mod-duyarlı galeri/thumbnail düzeni gizlenmiştir. 
 */
export const ViewImage = (_props: { modalType?: DataType; isIcon?: boolean; value: string }): JSX.Element => {
  throw new Error("Source available on request.");
};
