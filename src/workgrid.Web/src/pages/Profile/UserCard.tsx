import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Label, Spinner } from 'reactstrap'; 
import { useAuth } from 'context/AuthContext';
import { useUpdateAvatarUrl, useUserProfile } from 'hooks/useUser';
import { toast } from 'react-toastify';
import { useDeleteFile, useUploadFile } from 'hooks/useFiles';
import config from 'config';
import { getUserInitials } from 'common/utils/getUserInitials';
import { displayName } from 'common/utils/displayName';


export const UserCard = () => {
    const { user: usr } = useAuth(); 
    const { mutateAsync: uploadFileMutation } = useUploadFile(); 
    const { mutateAsync: updateAvatarUrlMutation } = useUpdateAvatarUrl();
    const { mutateAsync: deleteFileMutation } = useDeleteFile(); 
    const { data: user, isLoading } = useUserProfile(usr?.id ?? ""); 
    
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Lütfen geçerli bir resim dosyası seçin.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Resim boyutu 2MB'dan küçük olmalıdır.");
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarSubmit = async () => {
        if (!selectedFile || !user?.id) return;

        const oldProfilePictureUrl = user?.profilePictureUrl; 

        try {
            setIsUploading(true); 
            
            const uploadedUrl = await uploadFileMutation(selectedFile);  
            if (!uploadedUrl) throw new Error("Dosya yükleme başarısız oldu");

            await updateAvatarUrlMutation({
                userId: user.id,
                profilePictureUrl: uploadedUrl
            });

            if (oldProfilePictureUrl) { 
                await deleteFileMutation(oldProfilePictureUrl).catch(err => {
                    console.error("Eski dosya sunucudan silinemedi:", err);
                });
            }
            
            toast.success("Profil fotoğrafı başarıyla güncellendi!"); 
        } catch (error) {
            console.error("Avatar yükleme hatası:", error);
            toast.error("Profil fotoğrafı güncellenirken bir hata oluştu.");
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (user?.profilePictureUrl && previewUrl) {
            setSelectedFile(null); 
            setPreviewUrl(null);
            setIsUploading(false); 
        }
    }, [user?.profilePictureUrl]);

    const handleCancelPreview = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    if (isLoading) return <Card className="card-bg-fill"><CardBody className="p-4 text-center"><Spinner color="primary" /></CardBody></Card>;

    const currentImageSrc = previewUrl 
        ? previewUrl 
        : user?.profilePictureUrl 
            ? `${config.api.FILE_API_URL}/File/${user.profilePictureUrl}` 
            : null;

    return (
        <Card className="card-bg-fill">
            <CardBody className="p-4">
                <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto mb-4"> 
                        {user?.id && ( 
                            <span className="d-flex align-items-center justify-content-center w-100 position-relative">
                                {isUploading && (
                                    <div className="position-absolute d-flex align-items-center justify-content-center rounded-circle" 
                                        style={{ width: '120px', height: '120px', background: 'rgba(0,0,0,0.4)', zIndex: 3 }}>
                                        <Spinner size="sm" color="light" />
                                    </div>
                                )}

                                {!currentImageSrc ? (
                                    <div className="avatar-title border border-2 bg-light text-primary rounded-circle text-uppercase font-weight-bold fs-24" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        {getUserInitials(user.firstName, user.lastName)}
                                    </div>
                                ) : ( 
                                    <div> 
                                        <img className="rounded-circle avatar-xl img-thumbnail user-profile-image" 
                                            src={currentImageSrc}
                                            alt="Profil Fotoğrafı" 
                                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                        /> 
                                    </div>
                                )}  
                            </span>
                        )} 

                        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                            <Input  
                                key={previewUrl ? "has-preview" : "no-preview"}
                                id="profile-img-file-input" 
                                type="file"
                                className="profile-img-file-input" 
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            <Label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
                                <span className="avatar-title rounded-circle bg-light text-body" style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                                    <i className="ri-camera-fill"></i>
                                </span>
                            </Label>
                        </div>
                    </div>
                    <h5 className="fs-16 mb-1">{displayName(user!)}</h5>
                    <p className="text-muted mb-3">{user?.roles && user.roles.length > 0 ? user.roles.join(", ") : "Kullanıcı"}</p> 

                    {previewUrl && (
                        <div className="hstack gap-2 justify-content-center mt-2 animate__animated animate__fadeIn">
                            <button 
                                type="button" 
                                className="btn btn-primary btn-sm" 
                                onClick={handleAvatarSubmit}
                                disabled={isUploading}
                            >
                                {isUploading ? "Kaydediliyor..." : "Kaydet"}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-ghost-danger btn-sm" 
                                onClick={handleCancelPreview}
                                disabled={isUploading}
                            >
                                İptal
                            </button>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>  
    );
};