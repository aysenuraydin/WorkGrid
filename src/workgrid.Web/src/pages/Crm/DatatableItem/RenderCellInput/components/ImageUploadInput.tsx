import { forwardRef } from 'react';
import { DataType } from 'common/enums/DataType';
import { FileManagerRef } from './FileInput';

type Props = {
  downloadName: string;
  extra: any;
  modal: boolean;
  fileKey: string;
  value: string;
  modalType: DataType;
  selectedFile: { [key: string]: File[] };
  selectedForDeletion: { [key: string]: string[] };
  setSelectedFile: React.Dispatch<React.SetStateAction<{ [key: string]: File[] }>>;
  setSelectedForDeletion: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  onChangeVal: (value: string) => void;
};

/**
 * ImageUpload — AntD kart-görünümlü görsel yükleyici. 
 *  NE YAPAR (özet):
 *  AntD Upload bileşeniyle tekil veya çoklu görsel yükleme; önizleme, tür/boyut
 *  doğrulaması ve sunucu↔yerel dosya farkını yönetir. Ref ile upload()/
 *  injectFiles() açar.
 *
 *  - Tekil modda yeni dosya eskisini "silinecekler"e taşır; çoklu modda kaldırılan
 *      sunucu dosyaları farkla tespit edilip silmeye işaretlenir.
 *  - beforeUpload: uzantı ve maksimum boyut (MB) kontrolü; hatalıysa reddedilir.
 *  - Mevcut değer sunucu dosya listesine (done) çevrilip yerel seçimlerle birleştirilir.
 *
 *  Sunucu/yerel dosya diff'i ve yükleme doğrulaması  
 */
export const ImageUpload = forwardRef<FileManagerRef | null, Props>((_props, _ref) => {
  //  AntD upload + tekil/çoklu diff + tür/boyut doğrulama + ref köprü.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
});
