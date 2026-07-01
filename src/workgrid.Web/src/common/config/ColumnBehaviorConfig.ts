import { BehaviorAction } from "common/data/model";

export interface ColumnBehaviorConfig {
  dependsOn?: string[]; 
  visibleWhen?: string;   
  readonlyWhen?: string;
  requiredWhen?: string;
  calculate?: string; 

  events?: {
    onChange?: BehaviorAction[];
    onLoad?: BehaviorAction[];
    onBlur?: BehaviorAction[];
  };
  customJs?: string; 
}