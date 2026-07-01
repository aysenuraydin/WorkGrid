import { createSelector } from "reselect";

export const selectDatatableState = (state: any) => state.Datatable;

export const selectDatatableProps = createSelector(
  [selectDatatableState],
  (item) => ({
    tables: item.tables,
    tablesError: item.tablesError,
    isTablesSuccess: item.isTablesSuccess,
    isTablesLoading: item.isTablesLoading,

    columnCellsError : item.columnCellsError,
    isColumnCellsSuccess : item.isColumnCellsSuccess,
    isColumnCellsLoading : item.isColumnCellsLoading,
    columnCells : item.columnCells,
    columnCellsMessage : item.columnCellsMessage,
  })
);