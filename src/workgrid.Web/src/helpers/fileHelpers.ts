import React from "react";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { FileManagerRef } from "pages/Crm/DatatableItem/RenderCellInput/components/FileInput";

export const uploadAllFiles = async (
    filteredIds: number[],
    rowId: number,
    fileManagerRefs: React.MutableRefObject<{ [key: string]: React.RefObject<FileManagerRef> | null }>
) => {
    const result: { [key: string]: string } = {};
    for (const id of filteredIds) {
        const key = `cells.${rowId}.${id}`;
        const ref = fileManagerRefs.current[key]?.current;
        if (ref) {
            const uploadedValue = await ref.upload();
            if (uploadedValue) result[key] = uploadedValue;
        }
    }
    return result;
};

export const buildFinalFileValue = (
    originalValue: string,
    uploadedValue?: string,
    deletedList?: string[]
) => {
    const originalArr = originalValue ? originalValue.split(",").filter(Boolean) : [];
    const uploadedArr = uploadedValue ? uploadedValue.split(",").filter(Boolean) : [];
    const deletedSet = new Set(deletedList ?? []);
    const remaining = originalArr.filter(x => !deletedSet.has(x));
    return [...remaining, ...uploadedArr].join(",");
};

export const getFilteredFileColumnIds = (columns: any[]) =>
    columns
        .filter(col => {
            const type = col.type?.toLowerCase();
            return (
                type === InputTypeEnum.File.toLowerCase() ||
                type === InputTypeEnum.DropFiles.toLowerCase() ||
                type === InputTypeEnum.Video.toLowerCase() ||
                type === InputTypeEnum.Image.toLowerCase()
            );
        })
        .map(col => col.id);
