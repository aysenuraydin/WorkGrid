import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFileByName, uploadFile as onUploadFile, viewFile } from "../../src/helpers/backend_helper";


export const useDownLoadFile = (fileName: string) => {
    return useQuery({
        queryKey: ['fileList', fileName],
        queryFn: async () => await viewFile(fileName),
        enabled: !!fileName,
    });
};

export const useManuelDownloadFile = () => {
    return useMutation({
        mutationFn: async (fileName: string) => {
            const data = await viewFile(fileName);
            return data;
        },
        onSuccess: (data, fileName) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    });
};

export const useUploadFile = () => {
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: (file: File) => onUploadFile(file),
        onSuccess: () => { 
            // queryClient.invalidateQueries({ queryKey: ['fileList'], exact:true });
        },
        onError: (err: any) => {
            console.error("Upload failed:", err);
        }
    });
}; 

export const useDeleteFile = () => {
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: (fileName: string) => deleteFileByName(fileName),
        onSuccess: (_,fileName) => { 
            queryClient.invalidateQueries({ queryKey: ['fileList', fileName] });
        }
    });
};

