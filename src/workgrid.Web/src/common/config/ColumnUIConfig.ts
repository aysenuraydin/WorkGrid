import { AttributeEnum } from "common/enums/AttributeEnum";

export interface ColumnUIConfig {
  id: number;
  columnId: number; 
  value?: string;
  type: AttributeEnum;
}