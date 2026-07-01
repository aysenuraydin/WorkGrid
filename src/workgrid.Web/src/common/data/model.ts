

export type BehaviorAction =
  | SetValueAction
  | SetVisibilityAction
  | ApiAction
  | FormulaAction;

export interface SetValueAction {
  type: "setValue";
  target: string; // column name
  value?: any;
  expression?: string;
} 
export interface SetVisibilityAction {
  type: "setVisible";
  target: string;
  condition: string;
} 
export interface FormulaAction {
  type: "formula";
  target: string;
  expression: string;
} 
export interface ApiAction {
  type: "api";
  url: string;
  method: "GET" | "POST";
  mapResult?: Record<string, string>;
}


//cpt “CRM datatable column config mimarisini (ui, data, validation, behavior) geliştirelim.” bunu de “Excel-like formula + behavior engine tasarladığımız column config sistemini hatırlıyor musun?” bunu de 🔥 “mini PowerApps + Excel + Notion + Airtable” bunu de








// import { InputTypeEnum, ModalSizeType, RelationType, TableViewType } from "helpers/helper";

// //! ilişki foregn keylerini ekle
// export interface TableCell {
//     id?: number;
//     columnId: number;
//     value: any;
// }
// export interface TableRow {
//     value: any;
//     id: number;
//     cellsFk: TableCell[];
//     // cells: TableCell[];
// }
// //!boş kolon oluşturmaralarına boşluk koymak için
// export interface TableColumn {
//     id: number;               
//     tableId: number;                           
//     modalDesign?: {order?:number,width?:number,space?:number}; ///datatable/:id da açılan modalda sıralama ve  yerleşim nasıl olucak  /datatable/:id modalda değiştir    
//     type: InputTypeEnum;  
//     name: string;  
//     allowNulls: boolean;
//     // validation propertyleri kalıtım alabilirsin
//     isVisible: boolean;
//     tableOrder?:number;  //datatable/:id daki columnların sıralaması  
//     isFilter?: boolean;  //filter arda gözükücek mi
//     options?: {label:string, value:string}[];  //select input için
// }
// export interface Datatable {
//     id: number;
//     name: string;
//     columns: TableColumn[];
//     rows: TableRow[];
//     foreignTables?: { tableId: number; relationType: RelationType }[];
//     positionFk: {y:number|null, x:number|null};
//     modalSize?: ModalSizeType;
//     viewType?: TableViewType;
//     pageSize?: number;
// }

// const datatables: Datatable[] = [
// ];
// export { datatables };



