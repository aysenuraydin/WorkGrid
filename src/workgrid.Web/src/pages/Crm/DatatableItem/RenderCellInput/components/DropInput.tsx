import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { viewFile } from "helpers/backend_helper";
import { Input, Spinner } from "reactstrap";
import config from 'config';
import { Image } from 'antd';
import { DataType } from "common/enums/DataType";
import { toast } from "react-toastify"; 
import { FileManagerRef } from "./FileInput";
import { IExtraProps } from "..";
import { useDeleteFile, useUploadFile } from "hooks/useStorage";

type Props = {
  downloadName:string
  extra:IExtraProps | any
  modal:boolean
  fileKey:string
  modalType:DataType
  value:string
  loading:{ [key: string]: boolean []}, 
  selectedFile: { [key: string]: File [] },
  selectedForDeletion: { [key: string]: string[] };
  setLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean[] }>>
  setSelectedFile: React.Dispatch<React.SetStateAction<{ [key: string]: File [] }>> 
  setSelectedForDeletion: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  onChangeVal: (value: string) => void; 
};

export const DropManager = forwardRef<FileManagerRef | null, Props>(({
  downloadName,
  extra,
  modal,
  fileKey,
  modalType,
  value,
  loading,
  setLoading,
  selectedFile,
  setSelectedFile,
  selectedForDeletion,
  setSelectedForDeletion,
  onChangeVal, 
}, ref) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string[] }>({});
  const [serverPreviewUrls, setServerPreviewUrls] = useState<{ [key: string]: string }>({});
  const previewRef = useRef<{ [key: string]: string[] }>({});

  const { mutateAsync: uploadFileMutation } = useUploadFile();
  const { mutateAsync: deleteFileMutation } = useDeleteFile();

  const isMulti = extra.multiple;

  // Ref ile dışa açıyoruz
  useImperativeHandle(ref, () => ({
    upload: () => {
      console.log("DROP UPLOAD", selectedFile[fileKey]);
      return handleUpload();
    },
     injectFiles: (files: File[]) => {
        setSelectedFile(prev => ({ ...prev, [fileKey]: [...files] })); 
    }
  }));

useEffect(() => {
  if (!value) return;

  const fetchFiles = async () => {
    for (const name of value.split(",")) {
      if (serverPreviewUrls[name]) continue;

      const res = await fetch(`${config.api.FILE_API_URL}/File/${name}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      setServerPreviewUrls(prev => ({
        ...prev,
        [name]: blobUrl
      }));
    }
  };

  fetchFiles();
}, [value]);
  useEffect(() => {
    if (!modal) {
      
      setSelectedFile(prev => ({ ...prev, [fileKey]: [] }));
      setSelectedForDeletion(prev => ({ ...prev, [fileKey]: [] }));
      setLoading(prev => ({ ...prev, [fileKey]: [] }));
      setPreviewUrls(prev => ({ ...prev, [fileKey]: [] }));
      setServerPreviewUrls({});

      setChange(false);
      onChangeVal("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [modal]);

  /* ===== PREVIEW ===== */
  useEffect(() => {
    const files = selectedFile[fileKey];

    previewRef.current[fileKey]?.forEach(url =>
      URL.revokeObjectURL(url)
    );

    if (!files || files.length === 0) {
      previewRef.current[fileKey] = [];
      setPreviewUrls(prev => ({ ...prev, [fileKey]: [] }));
      return;
    }

    const urls = files.map(file => URL.createObjectURL(file));
    previewRef.current[fileKey] = urls;

    setPreviewUrls(prev => ({
      ...prev,
      [fileKey]: urls
    }));
  }, [fileKey, selectedFile[fileKey]]);

  /* ===== UPLOAD ===== */
  const handleUpload = async (): Promise<string> => {
    console.log()
    if (!selectedFile[fileKey] || selectedFile[fileKey].length === 0) return "";

    setLoading(prev => ({ ...prev, [fileKey]: selectedFile[fileKey].map(() => true) }));

    try {
      const uploadedNames: string[] = [];

      for (const file of selectedFile[fileKey]) {
        const uploadedName = await uploadFileMutation(file);
        console.log("uploadedName",uploadedName)
        uploadedNames.push(uploadedName);
      }
      setSelectedFile(prev => ({ ...prev, [fileKey]: [] }));
      const result = uploadedNames.join(",");
      onChangeVal(
        value ? `${value},${result}` : result
      );
      return result;

    } catch (err) {
      console.error("Upload error:", err);
      return "";
    } finally {
      setLoading(prev => ({ ...prev, [fileKey]: [] }));
    }
  };
  /* ===== DOWNLOAD ===== */
  const handleDownloadFile = async (name: string) => {
    const blob = await viewFile(name);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.click();

    URL.revokeObjectURL(url);
  };
  /* ===== DELETE ===== */
  const handleDeleteFile = async (index: number) => {
    // selectedForDeletion'dan ilgili id'yi al
    console.log("handleDeleteFile",handleDeleteFile)
    const idToDelete = selectedForDeletion[fileKey]?.[index];
    if (!idToDelete) {
      console.warn("Silinecek dosya id'si bulunamadı!");
      return;
    }

    await deleteFileMutation(idToDelete); 

    // State güncelle
    setSelectedForDeletion(prev => {
      const arr = [...(prev[fileKey] || [])];
      arr.splice(index, 1);
      return { ...prev, [fileKey]: arr };
    });
  };
  const handleSavedRemoveFromUI = (filename: string) => {
    const updated = value
        .split(",")
        .filter(x => x !== filename)
        .join(",");

    onChangeVal(updated); 

    setSelectedForDeletion(prev => ({
      ...prev,
      [fileKey]: [...(prev[fileKey] || []), filename]
    }));
  };
  const handleRemoveFromUI = (index: number) => {
    setSelectedFile(prev => {
      const arr = [...(prev[fileKey] || [])];
      arr.splice(index, 1);
      return { ...prev, [fileKey]: arr };
    });
    setSelectedForDeletion(prev => {
      const arr = [...(prev[fileKey] || [])];
      arr.splice(index, 1);
      return { ...prev, [fileKey]: arr };
    });

    if (inputRef.current) {
        inputRef.current.value = "" 
      }
  };
  const openPdfPreview = async (name: string) => {
    const res = await fetch(`${config.api.FILE_API_URL}/File/${name}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  const [change, setChange] = useState(false);
  const [hover, setHover] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    console.log("handleClick")
    inputRef.current?.click()
  }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const validateAndFilterFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const limit = extra.maxSizeMB || 50;
    const limitInBytes = limit * 1024 * 1024;
    
    // ".png,.jpg" -> ["png", "jpg"]
    const acceptedTypes : string[] = extra.accept
      ?extra.accept.toLowerCase().split(',')
      .map((t:string) => t.trim().replace('.', ''))
      : [];

    const validFiles: File[] = [];
    
    fileArray.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || "";
      const type = file.type.toLowerCase();

      // Format Kontrolü
      const isTypeMatch = acceptedTypes.length === 0 || 
        acceptedTypes.some(t => ext === t || type.includes(t.replace('*', '')));

      if (!isTypeMatch && extra.accept != "*/*") {
        toast.error(`"${file.name}" geçersiz format! Sadece ${extra.accept} yüklenebilir.`);
        return;
      }

      // Boyut Kontrolü
      if (file.size > limitInBytes) {
        toast.error(`"${file.name}" çok büyük! Maksimum ${limit}MB olmalıdır.`);
        return;
      }

      validFiles.push(file);
    });

    return validFiles;
  };
  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   if(modalType == DataType.View || extra.readOnly || extra.disabled) return;
  //   e.preventDefault();
  //   setChange(true);
    
  //   if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
  //     // KONTROL BURADA ÇALIŞACAK
  //     const filteredFiles = validateAndFilterFiles(e.dataTransfer.files);
      
  //     if (filteredFiles.length > 0) {
  //       setSelectedFile(prev => ({
  //         ...prev,
  //         [fileKey]: [...(prev[fileKey] || []), ...filteredFiles]
  //       }));
  //     }
  //     e.dataTransfer.clearData();
  //   }
  // }; 
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const processFiles = (newFiles: File[]) => {
    if (modalType === DataType.View || extra.readOnly || extra.disabled) return;
    
    // Güvenlik ve Format Kontrolleri (Senin yazdığın validate metodu)
    const filteredFiles = validateAndFilterFiles(newFiles);
    if (filteredFiles.length === 0) return;

    if (!isMulti) {
      // --- TEKLİ SEÇİM MANTIĞI ---
      const lastFile = filteredFiles[filteredFiles.length - 1];

      // Eğer sunucuda kayıtlı dosya varsa (value), onu silineceklere ekle
      if (value) {
        const serverFiles = value.split(",").filter(Boolean);
        setSelectedForDeletion(prev => ({
          ...prev,
          [fileKey]: Array.from(new Set([...(prev[fileKey] || []), ...serverFiles]))
        }));
        
        // Sunucu verisini UI'dan temizle
        onChangeVal(""); 
      }

      // Sadece en son seçilen dosyayı tut
      setSelectedFile(prev => ({
        ...prev,
        [fileKey]: [lastFile]
      }));
      setChange(true);

    } else {
      // --- ÇOKLU SEÇİM MANTIĞI ---
      setSelectedFile(prev => ({
        ...prev,
        [fileKey]: [...(prev[fileKey] || []), ...filteredFiles]
      }));
      setChange(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    // Gelen dosyaları array'e çevirip işleme gönderiyoruz
    processFiles(Array.from(e.target.files));
    
    // Aynı dosyayı tekrar seçebilmek için input'u resetle
    e.target.value = "";
  }
};
  
  const dropH = extra.size === "sm" 
                    ? "120px" 
                    : extra.size === "lg" 
                        ? "200px" 
                        : "160px"; 
  return (
    <div className={`${extra.hidden ? "d-none":""}`}> 
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          border: "0.7px solid",
          borderColor: change || hover ? "var(--vz-primary)" : "#00000020",
          backgroundColor: change  ? "rgba(var(--vz-primary-rgb), 0.3)" : modalType == DataType.View || extra.readOnly || extra.disabled? "#f0f2f8" : "",
          borderRadius: "15px",
          height: dropH,
          color:"gray",
        }}
      >
        <div 
            ref={divRef}
            tabIndex={0}  
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className="d-flex flex-column align-items-center justify-content-between p-4 py-5 cursor-pointer" 
          >
          <i className="ri-upload-cloud-2-line fs-24"></i>
          <span className={`${extra.size === "sm" ? "fs-14":"fs-18"}`}>{extra.placeholder ?? "Drop files here or click to upload."}</span>
        </div>
      </div>
      <Input
        type="file" 
        extra={{...extra}} 
        innerRef={inputRef}  
        className="form-control p-0"
        onChange={handleInputChange}
        style={{height:0, overflow:"hidden", borderColor:"#00000000"}} 
      />
      <Input
        type="text" 
        accept={extra.accept ?? undefined}
        value={
          value !== "" 
            ? value 
            : (selectedFile[fileKey]?.length > 0 ? "Dosyalar Seçildi" : "")
        }
        extra={{...extra}} 
        className="form-control p-0"
        style={{height:0, overflow:"hidden", borderColor:"#00000000"}}
        required={extra.required ?? undefined}  
      />

      {loading[fileKey]?.some(Boolean) && <Spinner />}
      {selectedFile[fileKey] && selectedFile[fileKey].map((file, index) => {
        const isPdf = file.name.toLowerCase().endsWith(".pdf");
        const isImg = [".png", ".jpg", ".jpeg", ".webp", ".gif"].some(ext =>
          file.name.toLowerCase().endsWith(ext)
        );
        const isVideo = [".mp4", ".mov", ".avi", ".mkv", ".webm"].some(ext =>
          file.name.toLowerCase().endsWith(ext)
        );
        const pUrl = previewUrls[fileKey]?.[index];

        return (
          <div key={index} className="my-3">
            
            <div className=" rounded bg-light shadow mt-2 d-flex align-items-center justify-content-between border border-primary">
              <div className="border d-flex align-items-center">
                {pUrl && (
                  isPdf ? (
                    <object
                        data={pUrl}
                        type="application/pdf"
                        width="130"
                        height="130"
                      />
                  ) : isImg ? <Image
                      height={70}
                      width={70}
                      style={{ objectFit:"cover"}}
                      alt="basic"
                      src={pUrl}
                    /> : isVideo ? (
                      <div className="ratio ratio-4x3 border bg-light"
                        style={{ width: "100px", height: "75px" }}>
                          <video
                              src={config.api.FILE_API_URL+"/File/"+value}
                              controls
                              style={{ width: "100px", height: "75px" }}
                          >
                              not supported
                          </video>
                      </div>
                    ):""
                )}
              <div className="p-2">
                  { isPdf 
                  ? <i className='mdi mdi-file-pdf-box fs-15 me-1' style={{color:"gray"}}></i>
                  : isImg 
                  ? <i className='ri-image-fill fs-15 me-1' style={{color:"gray"}}></i>
                  : isVideo 
                  ? <i className=' ri-movie-line fs-15 me-1' style={{color:"gray"}}></i>
                  : <i className=' ri-attachment-2 fs-15 me-1' style={{color:"gray"}}></i>
                  }
                  {file.name.substring(0,15).trim()}... .
                  {file.name.split(".")[file.name.split(".").length-1]}
              </div>
              </div>
              <div className="pe-3">
                <Spinner className="thin-spinner fs-16 me-3"/>
                <i
                  className="ri-delete-bin-6-line fs-16 me-3 cursor-pointer"
                  onClick={() => handleRemoveFromUI(index)}
                ></i>
                <i className="ri-download-2-line fs-16" style={{color:"gray"}} ></i>
              </div>
            </div>
          </div>
        );
      })}

      {value.length>0 && value.split(",") && value.split(",")
        .map((name, index) => {
          const isPdf = name.toLowerCase().endsWith(".pdf");
          const isImg = [".png", ".jpg", ".jpeg", ".webp", ".gif"].some(ext =>
            name.toLowerCase().endsWith(ext)
          );
          const isVideo = [".mp4", ".mov", ".avi", ".mkv", ".webm"].some(ext =>
          name.toLowerCase().endsWith(ext)
        );
          const pUrl =serverPreviewUrls[name];
          return (
            <div key={index} className="my-3">
              <div className="border rounded bg-light shadow mt-2 d-flex align-items-center justify-content-between cursor-pointer">
                <div className="border-border-danger d-flex align-items-center">
                  {pUrl && (
                    isPdf ? (
                      <iframe src={pUrl} height="130px" width="130px"/>
                    ) : isImg 
                    ? <Image
                        height={70}
                        width={70}
                        style={{ objectFit:"cover"}}
                        alt="basic"
                        src={pUrl}
                      /> 
                      : isVideo ? (
                      <div className="ratio ratio-4x3 border bg-light"
                        style={{ width: "100px", height: "75px" }}>
                          <video
                              src={config.api.FILE_API_URL+"/File/"+value}
                              controls
                              style={{ width: "100px", height: "75px" }}
                          >
                              not supported
                          </video>
                      </div> ): ""
                  )}
                
                <div className="p-2 d-flex align-items-center justify-content-between"
                onClick={() => openPdfPreview(name)}>
                  { isPdf 
                  ? <i className='mdi mdi-file-pdf-box fs-15' style={{color:"gray"}}></i>
                  : isImg 
                  ? <i className='ri-image-fill fs-15' style={{color:"gray"}}></i>
                  : isVideo 
                  ? <i className=' ri-movie-line fs-15 me-1' style={{color:"gray"}}></i>
                  :<i className=' ri-attachment-2 fs-15' style={{color:"gray"}}></i>
                  }
                    {name.substring(0,15).trim()}... .
                    {name.split(".")[name.split(".").length-1]}
                </div>
                </div>
                <div className="pe-3">
                  <i
                    className="ri-delete-bin-6-line fs-16 me-3 cursor-pointer"
                    onClick={() => handleSavedRemoveFromUI(name)}
                  ></i>
                  <i
                    className="ri-download-2-line fs-16 cursor-pointer"
                    onClick={() => handleDownloadFile(name)}
                  ></i>
                </div>
              </div>
            </div>
          );
      })} 
      <style>
        {`
        .thin-spinner {
          border-width: 1.8px !important;
          color:#00000080;
          width: 14px;
          height: 14px;
        }
      `}
      </style>
    </div>
    );
});
