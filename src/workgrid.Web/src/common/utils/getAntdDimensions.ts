import { PropertyEnum } from "common/enums/PropertyEnum";
import { ICellConfigs } from "../../pages/Crm/DatatableItem/RenderCellInput";

export const getAntdDimensions = (cellConfigs: ICellConfigs) => {
    const antdSize = (cellConfigs[PropertyEnum.size] === "small" || cellConfigs[PropertyEnum.size] === "middle" || cellConfigs[PropertyEnum.size] === "large") 
                    ? cellConfigs[PropertyEnum.size]
                    : "middle"; 
    const targetHeight = antdSize === 'small' ? 28 : antdSize === 'large' ? 39 : 33;
    const dateHeight = antdSize === 'small' ? '27.9px' : antdSize === 'large' ? '49px' : '37.7px';
    return { antdSize, targetHeight, dateHeight };
};