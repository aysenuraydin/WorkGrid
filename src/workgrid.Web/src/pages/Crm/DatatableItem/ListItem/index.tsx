
import { useMemo } from 'react'  
import { TableColumn } from 'common/data/TableColumn';
import { TableCell } from 'common/data/TableCell'; 
import { useCellLogic } from 'hooks/useCellLogic';  
import { DefaultCell } from './components/DefaultCell'; 
import { CELL_COMPONENT_MAP } from 'common/map/CELL_COMPONENT_MAP';
import { InputTypeEnum } from 'common/enums/inputTypeEnum';

export const ListItem = ({
    val, 
    clssnm, 
    col, 
    isIcon, 
    cells
}:{
    val:string, 
    clssnm?:string, 
    col?:TableColumn, 
    isIcon?: boolean, 
    cells:{[columnId: number]: TableCell[]} 
}) => { 

    const type: string = col?.type?.toLowerCase() ?? "";
    const colClass: string = " " + (col?.designFk?.class ?? "");

    interface ICellConfigs {
        [configType: string]: string | number | boolean | null | undefined;
    }

    const cellConfigs = useMemo<ICellConfigs>(() => {
        const config: ICellConfigs = {};
        const combinedConfigs = [...(col?.dataFk ?? []), ...(col?.uiFk ?? [])];
        combinedConfigs.forEach(item => {
            if (item && item.type) {
                config[item.type] = item.value;
            }
        });
        return config;
    }, [col?.dataFk, col?.uiFk]);

    const { inputProps } = useCellLogic(col, cellConfigs);  
    const isParent = type === InputTypeEnum.Parent.toLowerCase();
    const isForeignCol = col?.realTableId != null && !isParent
    const resolvedType = isForeignCol
                ? InputTypeEnum.ForeignColumn.toLowerCase()
                : type;

    const Component = CELL_COMPONENT_MAP[resolvedType] || DefaultCell;
    
    return (
        <Component 
            val={val}
            clssnm={clssnm}
            colClass={colClass}
            inputProps={inputProps}
            isIcon={isIcon}

            prefix={inputProps?.prefix} 
            suffix={inputProps?.suffix}

            col={col} 
            cells = {cells[col?.realColumnId ?? 0]}
        />
    );
}

