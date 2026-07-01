
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { viewFile } from "helpers/backend_helper"; 
import { Input, Spinner } from "reactstrap";
import config from 'config';
import { Image } from 'antd';
import { DataType } from "common/enums/DataType";
import { toast } from "react-toastify"; 
import { IExtraProps } from ".."; 
import { useDeleteFile, useUploadFile } from "hooks/useStorage";
type Props = {
  downloadName:string,
  extra:IExtraProps | any,
  modal:boolean,
  fileKey:string,
  value:string,
  modalType:DataType,
  loading:{ [key: string]: boolean []}, 
  selectedFile: { [key: string]: File [] },
  selectedForDeletion: { [key: string]: string[] },
  setLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean[] }>>,
  setSelectedFile: React.Dispatch<React.SetStateAction<{ [key: string]: File [] }>>,
  setSelectedForDeletion: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>,
  onChangeVal: (value: string) => void,
};
export type FileManagerRef = {
  upload: () => Promise<string | null>
  injectFiles: (files: File[]) => void; 
  // delete: (index: number) => Promise<void>;
} | null;

const FileManager = forwardRef<FileManagerRef | null, Props>(({
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

    const { mutateAsync: uploadFileMutation } = useUploadFile();
    const { mutateAsync: deleteFileMutation } = useDeleteFile(); 

  const isMulti = extra.multiple;

  useImperativeHandle(ref, () => ({
    upload: handleUpload,
    // delete: handleDeleteFile,
    injectFiles: (files: File[]) => {
        setSelectedFile(prev => ({ ...prev, [fileKey]: [...files] })); 
    }
  }));

  useEffect(() => {
    if (!selectedFile[fileKey] || selectedFile[fileKey].length === 0) return;

    const urls = selectedFile[fileKey].map(file => URL.createObjectURL(file));

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFile[fileKey]]);
  useEffect(() => {
    return () => {
      Object.values(serverPreviewUrls).forEach(url =>
        URL.revokeObjectURL(url)
      );
    };
  }, []);
  useEffect(() => {
    if (!value) return;

    value.split(",").forEach(async (name) => {
      if (serverPreviewUrls[name]) return;

      const url = `${config.api.FILE_API_URL}/File/${name}`;
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      setServerPreviewUrls(prev => ({
        ...prev,
        [name]: blobUrl
      }));
    });
    return () => {
      Object.values(serverPreviewUrls).forEach(url =>
        URL.revokeObjectURL(url)
      );
    };
  }, [value]);
  useEffect(() => {
    if (!modal) { 
      setSelectedFile(prev => ({ ...prev, [fileKey]: [] }));
      setSelectedForDeletion(prev => ({ ...prev, [fileKey]: [] }));
      setLoading(prev => ({ ...prev, [fileKey]: [] }));
      setPreviewUrls(prev => ({ ...prev, [fileKey]: [] }));
      setServerPreviewUrls({});

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [modal]);

  /* ===== PREVIEW ===== */
  useEffect(() => {
    if (!selectedFile[fileKey] || selectedFile[fileKey].length === 0) {
      setPreviewUrls(prev => ({ ...prev, [fileKey]: [] }));
      return;
    }
    
    const urls = selectedFile[fileKey].map(file =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(prev => ({ ...prev, [fileKey]: urls }));

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFile[fileKey]]);

  /* ===== UPLOAD ===== */
  const handleUpload = async (): Promise<string> => {
    if (!selectedFile[fileKey] || selectedFile[fileKey].length === 0) return "";
    setLoading(prev => ({ ...prev, [fileKey]: selectedFile[fileKey].map(() => true) }));

    try {
      const uploadedNames: string[] = [];

      for (const file of selectedFile[fileKey]) {
        const uploadedName =  await uploadFileMutation(file);
        uploadedNames.push(uploadedName);
      }
      setSelectedFile(prev => ({ ...prev, [fileKey]: [] }));
      const uploaded = uploadedNames.join(",");
      onChangeVal(uploaded);
      return uploaded;

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
  return (
    <div className={`${extra.hidden ? "d-none":""}`}> 
      <Input
        type="file"
        innerRef={inputRef}  
        accept={extra.accept ?? undefined}
        extra={{...extra}} 
        disabled={modalType==DataType.View} 
        multiple={isMulti}
        style={(modalType == DataType.View || extra.readOnly || extra.disabled) ? {backgroundColor:"#f0f2f8" }:{}}
        className="form-control"  
        size={extra.size ?? undefined} 
        onChange={(e) => {
          if(modalType == DataType.View || extra.readOnly || extra.disabled) return;
          const files = e.target.files;
          if (!files || files.length === 0) return; 

          const limit = extra.maxSizeMB || 50;
          const limitInBytes = limit * 1024 * 1024;
          
          const acceptedTypes = extra.accept
            ? extra.accept.toLowerCase().split(',')
            .map((type:string) => type.trim().replace('.', ''))
            : [];

          const validFiles: File[] = [];
          const errorMessages: string[] = [];

          Array.from(files).forEach((file) => {
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || "";
            const fileType = file.type.toLowerCase();  
            
            const isTypeMatch = acceptedTypes.length === 0 || 
                                acceptedTypes.some((type:string) => 
                                  fileExtension === type || 
                                  fileType.includes(type.replace('*', ''))
                                );

            if (!isTypeMatch && extra.accept != "*/*") {
              toast.error(`"${file.name}" geçersiz format! Sadece ${extra.accept} yüklenebilir.`);
              return;
            }
            
            if (file.size > limitInBytes) {
              errorMessages.push(`"${file.name}" çok büyük (Max: ${limit}MB)!`);
              return;
            }

            validFiles.push(file);
          });
          
          if (errorMessages.length > 0) {
            errorMessages.forEach(msg => toast.error(msg));
          }
          
          // if (validFiles.length > 0) {
          //   setSelectedFile((prev) => ({
          //     ...prev,
          //     [fileKey]: [...(prev[fileKey] || []), ...validFiles],
          //   }));
          // }
          if (validFiles.length > 0) {
            if (isMulti) {
              setSelectedFile((prev) => ({
                ...prev,
                [fileKey]: [...(prev[fileKey] || []), ...validFiles],
              }));
            } else { 
              if (value) {
                const oldFiles = value.split(",");
                setSelectedForDeletion(prev => ({
                  ...prev,
                  [fileKey]: [...(prev[fileKey] || []), ...oldFiles]
                }));

                onChangeVal(""); 
              }
              
              setSelectedFile((prev) => ({
                ...prev,
                [fileKey]: [validFiles[0]], 
              }));
            }
          }

          e.target.value = "";  
        }} 
      />
      <Input
        type="text" 
        accept={extra.accept ?? undefined}   
        value={
          value !== "" 
            ? value 
            : (selectedFile[fileKey]?.length > 0 ? "Dosyalar Seçildi" : "")
        }
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
              <div className="border-border-danger d-flex align-items-center">
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
                    :<i className=' ri-attachment-2 fs-15 me-1' style={{color:"gray"}}></i>
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
                    /> : isVideo
                    ?  <div className="ratio ratio-4x3 border bg-light"
                        style={{ width: "100px", height: "75px" }}>
                          <video
                              src={config.api.FILE_API_URL+"/File/"+value}
                              controls
                              style={{ width: "100px", height: "75px" }}
                          >
                              not supported
                          </video>
                      </div>
                    :""
                )}
              
              <div className="p-2 d-flex align-items-center justify-content-between"
              onClick={() => openPdfPreview(name)}>
                { isPdf 
                ? <i className='mdi mdi-file-pdf-box fs-15' style={{color:"gray"}}></i>
                : isImg 
                ? <i className='ri-image-fill fs-15' style={{color:"gray"}}></i>
                :  isVideo 
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

export default FileManager;


