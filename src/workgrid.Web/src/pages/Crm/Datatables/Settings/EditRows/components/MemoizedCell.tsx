import { DataType } from "common/enums/DataType";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import React, { MutableRefObject } from "react";
import { Datatable } from "common/data/Datatable";
import { TableColumn } from "common/data/TableColumn";
import { TableCell } from "common/data/TableCell";
import { FileData } from "components/Common/interfaces/TableRowContextType";
import { UpdateItem } from "pages/Crm/Datatables/components/Datatables";
import { useMemoizedCell } from "../hooks/useMemoizedCell";
import { RenderCellInput } from "pages/Crm/DatatableItem/RenderCellInput";

export interface MemoizedCellProps {
    value: any;
    table: Datatable;
    cell: TableCell | undefined;
    cells: { [columnId: number]: TableCell[]; };
    formik: any;
    handleChange: (value: any, colId: number, rowId: number, cellId: number, relatedCols?: any[] | undefined, rowsString?: string | undefined) => void;
    col: TableColumn;
    rowId: number;
    fileDataRef: MutableRefObject<FileData>;
    columns: TableColumn[];
    fileManagerRefs: MutableRefObject<{ [key: string]: any; }>;
    pendingUpdatesRef: MutableRefObject<{ [cellId: number]: UpdateItem; } | undefined>;
    foreignRows: { [rowId: number]: TableCell[]; };
    isEditRow: boolean;
    formikValuesRef: MutableRefObject<any>;
}

export const MemoizedCell = React.memo((props: MemoizedCellProps) => {
    const {
        table,
        cell,
        cells,
        formik,
        handleChange,
        col,
        rowId,
        fileDataRef,
        columns,
        fileManagerRefs,
        pendingUpdatesRef,
        foreignRows
    } = props;

    const mapKey = `cells.${rowId}.${col.id}`;

    const {
        onValueChange,
        handleSetSelectedForDeletion,
        handleLoading,
        handleFileSelect,
        localFiles,
        localLoading,
        localDeletions
    } = useMemoizedCell(
        mapKey,
        fileDataRef,
        pendingUpdatesRef,
        handleChange,
        cell?.id ?? 0
    );

    // AYNA KOLON: realColumnId + realTableId dolu olan kolon.
    const isForeignCol = col?.realColumnId != null && col?.realTableId != null;

    // Tipi ForeignColumn mu? -> ona ID gider (select gibi).
    // Diger ayna kolonlara (Text/Select ama realColumnId dolu) -> LABEL gider.
    const isForeignTyped =
        col.type.toLowerCase() === InputTypeEnum.ForeignColumn.toLowerCase();

    var displayValue = formik.values.cells?.[rowId]?.[col.id];

    if (isForeignCol) {
        // Bag kolonunu bul (ayni realTableId, realColumnId == null)
        const bagKolon = columns.find((c: any) =>
            c.realTableId === col.realTableId && c.realColumnId == null
        );

        // id listesi: once bag kolonu (guncel), yoksa kendi degeri
        const bagVal = bagKolon ? formik.values.cells?.[rowId]?.[bagKolon.id] : undefined;
        const ownVal = formik.values.cells?.[rowId]?.[col.id];
        const raw = (bagVal ?? "") !== "" ? bagVal : ownVal;   // <- HAM ID(ler)

        if (isForeignTyped) {
            // Tipi ForeignColumn -> ID gonder (label cozme YOK)
            displayValue = raw;
        } else {
            // Diger ayna kolonlar -> LABEL coz ve gonder
            const foreignRowIdList = (raw ?? "")
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean);

            const allForeignRows = foreignRows || {};

            const labels = foreignRowIdList
                .map((fId: string) => {
                    const rowCells = allForeignRows[Number(fId)];
                    if (!rowCells) return null;
                    const targetCell = rowCells.find(
                        c => c.columnId === Number(col.realColumnId)
                    );
                    return targetCell ? targetCell.value : null;
                })
                .filter((val: string | null) => val !== null && val !== "");

            displayValue = labels.length > 0 ? labels.join(", ") : raw;
        }
        if (!isForeignTyped) {
    console.log("LIST AYNA DEBUG", {
        colId: col.id,                    // 124
        colName: col.name,                // icon
        realColumnId: col.realColumnId,   // 13 - aranan columnId
        raw,                              // id listesi (orn "1")
        foreignRowKeys: Object.keys(foreignRows || {}),  // hangi satirlar yuklu?
        // raw'daki ilk id'nin hucreleri:
        ilkSatirHucreleri: (foreignRows || {})[Number((raw ?? "").split(",")[0]?.trim())]
            ?.map((c: any) => ({ columnId: c.columnId, value: c.value })),
        cozulenLabel: displayValue,
    });
}
 
    }

    return (
        <RenderCellInput
            table={table}
            cell={cell}
            col={col}
            rowId={rowId}
            modalType={DataType.Edit}
            value={displayValue}
            handleChange={onValueChange}
            formik={formik}
            columns={columns}
            cells={cells}
            fileManagerRefs={fileManagerRefs}
            selectedFile={localFiles}
            setSelectedFile={handleFileSelect}
            loading={localLoading}
            setLoading={handleLoading}
            selectedForDeletion={localDeletions}
            setSelectedForDeletion={handleSetSelectedForDeletion}
            isEditRow={true}
        />
    );
}, (prev, next) => {
    const rId = prev.rowId;
    const cId = prev.col.id;

    if (prev.formik.values.cells?.[rId]?.[cId] !== next.formik.values.cells?.[rId]?.[cId]) return false;
    if (prev.formik.errors.cells?.[rId]?.[cId] !== next.formik.errors.cells?.[rId]?.[cId]) return false;
    if (prev.formik.touched.cells?.[rId]?.[cId] !== next.formik.touched.cells?.[rId]?.[cId]) return false;
    if (prev.foreignRows !== next.foreignRows) return false;

    return true;
});