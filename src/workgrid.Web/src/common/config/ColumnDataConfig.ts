import { PropertyEnum } from "common/enums/PropertyEnum";

export interface ColumnDataConfig {
  id: number;
  columnId: number; 
  value?: string;
  type: PropertyEnum;
}