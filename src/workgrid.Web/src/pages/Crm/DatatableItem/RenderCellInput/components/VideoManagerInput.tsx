import { forwardRef } from "react";
import { DataType } from "common/enums/DataType";
import { FileManagerRef } from "./FileInput";

type Props = {
  downloadName: string;
  extra: any;
  modal: boolean;
  fileKey: string;
  modalType: DataType;
  value: string;
  loading: { [key: string]: boolean[] };
  selectedFile: { [key: string]: File[] };
  selectedForDeletion: { [key: string]: string[] };
  setLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean[] }>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<{ [key: string]: File[] }>>;
  setSelectedForDeletion: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  onChangeVal: (value: string) => void;
};

/**
 * VideoManager — video yükleme/önizleme/silme yöneticisi.
 *
 *  NE YAPAR (özet):
 *  Tekil/çoklu video yükleme alanı; gömülü oynatıcı önizlemesi, tür/boyut
 *  doğrulaması, yükleme/indirme/silme akışını hücre-anahtarlı (fileKey) durum
 *  üzerinde yönetir. Ref ile upload()/injectFiles() açar.
 *
 *  - beforeUpload benzeri kontrol: kabul edilen uzantı (varsayılan mp4/mov/
 *      avi/mkv/webm) ve maksimum boyut; hatalıysa reddedilir.
 *  - Tekil modda yeni video eskisini "silinecekler"e taşır.
 *  - Modal kapanınca/oluştur modunda durum sıfırlanır; sunucu ve yerel dosyalar
 *      blob önizlemeyle listelenir. 
 */
export const VideoManager = forwardRef<FileManagerRef | null, Props>((_props, _ref) => {
  //  Video upload/önizleme/sil/indir + tür/boyut doğrulama + ref köprü.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
});
