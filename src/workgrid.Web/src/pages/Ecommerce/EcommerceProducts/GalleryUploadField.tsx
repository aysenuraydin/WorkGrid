import React, { useState, useEffect } from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useUploadFile } from "hooks/useFiles";
import { toast } from "react-toastify";
import config from "config";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const isExternal = (v: string) =>
  v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/");

const toUrl = (name: string) =>
  isExternal(name) ? name : `${config.api.FILE_API_URL}/File/${name}`;

interface GalleryUploadFieldProps {
  label?: string;
  accept?: string;
  value: string;
  onChange: (commaSeparated: string) => void;
  onMarkForDeletion?: (fileName: string) => void;
}

export const GalleryUploadField: React.FC<GalleryUploadFieldProps> = ({
  label = "Gallery",
  accept = "image/*",
  value,
  onChange,
  onMarkForDeletion,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { mutateAsync: uploadFile } = useUploadFile();

  useEffect(() => {
    const names = (value ?? "").split(",").map(s => s.trim()).filter(Boolean);
    setFileList(
      names.map((name, i) => ({
        uid: `existing-${i}-${name}`,
        name,
        status: 'done' as const,
        url: toUrl(name),
      }))
    );
  }, [value]);

  const namesFromList = (list: UploadFile[]) =>
    list
      .filter(f => f.status == 'done')
      .map(f => f.name)
      .filter(Boolean)
      .join(",");

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);
    try {
      const newFileName: string = await uploadFile(file);
      onSuccess({ name: newFileName }, file);
      toast.success(`${file.name} yüklendi.`);
    } catch (e) {
      toast.error(`${file.name} yüklenemedi.`);
      onError(e);
    } finally {
      setUploading(false);
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newList, file }) => {
    const synced = newList.map((f) => {
      if (f.status == 'done' && f.response?.name) {
        return { ...f, name: f.response.name, url: toUrl(f.response.name) };
      }
      return f;
    });
    setFileList(synced);
    onChange(namesFromList(synced));
  };

  const handleRemove = (file: UploadFile) => {
    if (file.name && !isExternal(file.name) && onMarkForDeletion) {
      onMarkForDeletion(file.name);
    }
    const next = fileList.filter(f => f.uid !== file.uid);
    setFileList(next);
    onChange(namesFromList(next));
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{uploading ? 'Yükleniyor...' : 'Yükle'}</div>
    </button>
  );

  return (
    <div>
      {label && (
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="fs-12 fw-medium">{label}</span>
        </div>
      )}

      <Upload
        customRequest={customUpload}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        accept={accept}
        multiple                
      >
        {uploadButton}
      </Upload>

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