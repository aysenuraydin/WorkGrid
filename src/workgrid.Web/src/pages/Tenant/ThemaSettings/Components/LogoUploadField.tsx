import React, { useState, useEffect } from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useUploadFile } from "hooks/useFiles";
import { toast } from "react-toastify";
import config from "config";
import { Input } from 'reactstrap';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface LogoUploadFieldProps {
  isHeightHidden?: boolean;
  label: string;
  badge: string;
  badgeColor: string;
  bg: string;
  accept: string;
  value: string;  
  onChange: (fileName: string) => void; 
  onMarkForDeletion: (fileName: string) => void;  
  heightValue?: string;
  onHeightChange?: (v: string) => void;
}

export const LogoUploadField: React.FC<LogoUploadFieldProps> = ({
  isHeightHidden,
  label,
  badge,
  badgeColor,
  bg,
  accept,
  value,
  onChange,
  onMarkForDeletion,
  heightValue,
  onHeightChange,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Antd'nin kontrol ettiği dosya listesi state'i
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { mutateAsync: uploadFile } = useUploadFile();
  const isExternalUrl = value?.startsWith("http://") || value?.startsWith("https://") || value?.startsWith("/");

  // 1. Sayfa ilk açıldığında veya veritabanından veri geldiğinde fileList'i senkronize et
  useEffect(() => {
    if (value) {
      const fullUrl = isExternalUrl ? value : `${config.api.FILE_API_URL}/File/${value}`;
      setFileList([
        {
          uid: '-1',
          name: value,
          status: 'done',
          url: fullUrl,
        }
      ]);
    } else {
      setFileList([]);
    }
  }, [value, isExternalUrl]);

  // Resme tıklanınca büyümesini sağlayan ön izleme tetikleyicisi (Senin attığın çalışan mantık)
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Antd'nin mock API'sini devre dışı bırakıp kendi dosya yükleme servisimize bağlıyoruz
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);

    try {
      const newFileName: string = await uploadFile(file);

      // Eğer halihazırda eski bir dosya varsa sunucudan silinmek üzere listeye ekle
      if (value && !isExternalUrl) {
        onMarkForDeletion(value);
      }

      // Başarılı yüklemeyi Formik'e bildiriyoruz
      onChange(newFileName);
      toast.success("Dosya başarıyla yüklendi.");
      onSuccess("ok");
    } catch (e) {
      toast.error("Sunucuya yükleme başarısız oldu.");
      onError(e);
      // Hata durumunda listeyi temizle ki takılı kalmasın
      setFileList([]);
    } finally {
      setUploading(false);
    }
  };

  // Listede değişiklik olduğunda (Örn: Dosya seçildiğinde veya silindiğinde)
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // maxCount={1} olduğu için gelen listeyi doğrudan set ediyoruz
    setFileList(newFileList);
  };

  const handleRemove = () => {
    if (value && !isExternalUrl) {
      onMarkForDeletion(value);
    }
    onChange("");  
    setFileList([]);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{uploading ? 'Yükleniyor...' : 'Yükle'}</div>
    </button>
  );

  return (
    <div className="h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="fs-12 fw-medium">{label}</span>
          <span className={`badge bg-${badgeColor} fs-10`}>{badge}</span>
        </div> 
        <div className="logo-upload-wrapper">
          <Upload
            customRequest={customUpload}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={handleRemove}
            accept={accept}
            maxCount={1}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
        <style>{`
          .logo-upload-wrapper .ant-upload.ant-upload-select {
            width: 100% !important;
            height: 120px !important;
          }
          .logo-upload-wrapper .ant-upload-list-item-container,
          .logo-upload-wrapper .ant-upload-list-item {
            width: 100% !important;
            height: 120px !important;
          }
        `}</style>
        <div className="input-group input-group-sm mt-2">
          <span className="input-group-text"><i className="ri-links-line" /></span>
          <input
            type="text"
            className="form-control form-control-sm font-monospace fs-11"
            placeholder="veya URL yapıştır…"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button className="btn btn-outline-danger btn-sm" type="button" onClick={handleRemove}>
              <i className="ri-close-line" />
            </button>
          )}
        </div>
        { isHeightHidden == null &&
          <div className="input-group input-group-sm mt-1">
            <span className="input-group-text fs-11 text-muted">
              <i className="ri-arrow-up-down-line" />
            </span>
            <Input
              type="number"
              className={`form-control form-control-sm font-monospace fs-11 ${onHeightChange!= undefined? "":"bg-light"}`}
              placeholder={onHeightChange!= undefined? "40px":""}
              value={heightValue ?? ""}
              disabled={onHeightChange!= undefined? false:true}
              onChange={(e) => {if(onHeightChange!= undefined) onHeightChange(e.target.value)}}
            />
          </div>
        }
      </div>

      { isHeightHidden == null && 
          <div className={`border rounded p-2 d-flex align-items-center justify-content-center mt-3 ${bg}`}
            style={{ minHeight: 60, maxHeight: 60, overflow: "hidden" }}>
            {fileList.length > 0 && fileList[0].url ? (
              <img 
                src={fileList[0].url} 
                alt={label}
                style={{ maxHeight: 44, maxWidth: "100%", objectFit: "contain" }} 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-muted fs-11">
                <i className="ri-image-line me-1" />Önizleme Yok
              </span>
            )}
          </div>
      }

      {previewImage && (
        <Image
          styles={{ root: { display: 'none' } }}
          preview={{
            open: previewOpen,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};