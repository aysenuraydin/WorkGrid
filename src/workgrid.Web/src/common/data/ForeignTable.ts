export interface ForeignTable{
  id: number;
  foreignTableId: number;
  createOrUpdateColumnId: string;
  foreignTableName?: string;
  selectedRowIds: string;
  listColumnIds?: string;
  isMultiSelect?: boolean;
}

