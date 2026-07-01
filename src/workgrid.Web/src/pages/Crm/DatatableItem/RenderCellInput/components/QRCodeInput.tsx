import { IExtraProps } from '..';

interface InputProps {
  extra: IExtraProps | any;
  value: any;
}

/**
 * QRCodeInput — değerden QR kod üreten giriş. 
 *  URL/metin değerinden yüksek hata düzeltmeli bir QR kod üretir ve ortasına
 *  marka etiketi bindirir; ayrıca değeri gizli input'ta tutar. Gizlenmiştir. 
 */
export const QRCodeInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
