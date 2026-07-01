import { forwardRef } from "react";
import { DataType } from "common/enums/DataType";
import { FileManagerRef } from "./FileInput";
import { IExtraProps } from "..";

type Props = {
  downloadName: string;
  extra: IExtraProps | any;
  modal: boolean;
  fileKey: string;
  value: string;
  modalType: DataType;
  loading: { [key: string]: boolean[] };
  selectedFile: { [key: string]: File[] };
  selectedForDeletion: { [key: string]: string[] };
  setLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean[] }>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<{ [key: string]: File[] }>>;
  setSelectedForDeletion: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  onChangeValue: (value: string) => void;
};

/**
 * ImageManager — sürükle-bırak dosya/görsel yükleme yöneticisi. 
 *  NE YAPAR (özet):
 *  Çok-dosyalı görsel/PDF yükleme alanı; drag-drop veya tıkla-seç, satır-içi
 *  önizleme, yükleme, indirme ve silme akışını hücre-anahtarlı (fileKey) durum
 *  üzerinde yönetir. Üst bileşene ref ile upload()/injectFiles() açar.
 *
 *  - Sunucudaki mevcut dosyalar blob olarak çekilip önizlenir; yeni seçilenler
 *      için object URL üretilip (ve temizlenip) önizleme yapılır.
 *  - upload(): seçili dosyalar tek tek yüklenip isimleri değere eklenir.
 *  - Silme: kayıtlı dosyalar "silinecekler" listesine alınır (kaydetince
 *      backend'den silinir); yerel seçimler anında kaldırılır.
 *  - Modal kapanınca/oluştur modunda durum sıfırlanır.
 *
 *  Ref-imperative yükleme köprüsü ve önizleme/temizleme yaşam döngüsü bu
 *  dosyanın özgün emeğidir; paylaşılan sürümde gizlenmiştir. 
 */
export const ImageManager = forwardRef<FileManagerRef | null, Props>((_props, _ref) => {
  //  Drag-drop çok-dosya yükleme/önizleme/sil/indir + ref-imperative köprü.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
});
