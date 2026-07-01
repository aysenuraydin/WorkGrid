import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { RelationType } from "common/enums/RelationType";
import { ColumnUIConfig } from "common/config/ColumnUIConfig";
import { ColumnDesignConfig } from "common/config/ColumnDesignConfig";
import { ColumnDataConfig } from "common/config/ColumnDataConfig";
import { ColumnValidationConfig } from "common/config/ColumnValidationConfig";
import { ModalDesign } from "./ModalDesign";
import { IDataAudit } from "./IDataAudit";

export interface TableColumn  extends IDataAudit{
  id: number;
  tableId: number;
  type: InputTypeEnum;
  name: string;
  isVisible: boolean;
  tableOrder?: number;
  isFilter?: boolean;
  realColumnId?: number;
  realTableId?: number;
    
  modalDesignFk?: ModalDesign;
  uiFk?: ColumnUIConfig[];
  designFk?: ColumnDesignConfig;
  dataFk?: ColumnDataConfig[];
  validationFk?: ColumnValidationConfig;

  functionText?: string;

  // behavior?: ColumnBehaviorConfig;
  // meta?: ColumnMetaConfig; 
}