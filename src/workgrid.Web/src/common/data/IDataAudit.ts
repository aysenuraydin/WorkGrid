export interface IDataAudit {
  createdAt?: any;
  createdBy?: string;
  createdByUserId?: string;        

  lastModifiedAt?: any;
  lastModifiedBy?: string;
  lastModifiedByUserId?: string;   

  deletedAt?: any;
  deletedBy?: string;
  deletedByUserId?: string;     
}