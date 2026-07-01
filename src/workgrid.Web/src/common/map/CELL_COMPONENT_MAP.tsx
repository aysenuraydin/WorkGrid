
import { InputTypeEnum } from 'common/enums/inputTypeEnum';  
import { CheckboxCell } from '../../pages/Crm/DatatableItem/ListItem/components/CheckboxCell';
import { RadioCell } from '../../pages/Crm/DatatableItem/ListItem/components/RadioCell';
import { RangeCell } from '../../pages/Crm/DatatableItem/ListItem/components/RangeCell';
import { EmailCell } from '../../pages/Crm/DatatableItem/ListItem/components/EmailCell';
import { TelCell } from '../../pages/Crm/DatatableItem/ListItem/components/TelCell';
import { FileCell } from '../../pages/Crm/DatatableItem/ListItem/components/FileCell';
import { VideoCell } from '../../pages/Crm/DatatableItem/ListItem/components/VideoCell';
import { UrlCell } from '../../pages/Crm/DatatableItem/ListItem/components/UrlCell';
import { PasswordCell } from '../../pages/Crm/DatatableItem/ListItem/components/PasswordCell';
import { DateCell } from '../../pages/Crm/DatatableItem/ListItem/components/DateCell';
import { TimeCell } from '../../pages/Crm/DatatableItem/ListItem/components/TimeCell';
import { TextareaCell } from '../../pages/Crm/DatatableItem/ListItem/components/TextareaCell';
import { SelectCell } from '../../pages/Crm/DatatableItem/ListItem/components/SelectCell';
import { BadgeCell } from '../../pages/Crm/DatatableItem/ListItem/components/BadgeCell';
import { AlertCell } from '../../pages/Crm/DatatableItem/ListItem/components/AlertCell'; 
import { ImageCell } from '../../pages/Crm/DatatableItem/ListItem/components/ImageCell';
import { QRCode, Rate } from 'antd';
import { ColorCell } from '../../pages/Crm/DatatableItem/ListItem/components/ColorCell';
import { ForeignCell } from '../../pages/Crm/DatatableItem/ListItem/components/ForeignCell';
import { BadgesCell } from 'pages/Crm/DatatableItem/ListItem/components/BadgesCell';
import { IconCell } from 'pages/Crm/DatatableItem/ListItem/components/IconCell';
import { ParentCell } from 'pages/Crm/DatatableItem/ListItem/components/ParentCell';
import { UsersCell } from 'pages/Crm/DatatableItem/ListItem/components/UsersCell';
import { SwitchCell } from 'pages/Crm/DatatableItem/ListItem/components/SwitchCell';

export const CELL_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    [InputTypeEnum.ForeignColumn.toLowerCase()]: ForeignCell,
    [InputTypeEnum.Color.toLowerCase()]: ColorCell,
    [InputTypeEnum.Checkbox.toLowerCase()]: CheckboxCell,
    [InputTypeEnum.Radio.toLowerCase()]: RadioCell,
    [InputTypeEnum.Range.toLowerCase()]: RangeCell,
    [InputTypeEnum.Email.toLowerCase()]: EmailCell,
    [InputTypeEnum.Tel.toLowerCase()]: TelCell,
    [InputTypeEnum.File.toLowerCase()]: FileCell,
    [InputTypeEnum.DropFiles.toLowerCase()]: FileCell,
    [InputTypeEnum.URL.toLowerCase()]: UrlCell,
    [InputTypeEnum.Password.toLowerCase()]: PasswordCell,
    [InputTypeEnum.Select.toLowerCase()]: SelectCell,
    [InputTypeEnum.Badge.toLowerCase()]: BadgeCell,

    [InputTypeEnum.Alert.toLowerCase()]: AlertCell,
    
    [InputTypeEnum.Video.toLowerCase()]: VideoCell,
    [InputTypeEnum.Image.toLowerCase()]: ImageCell,

    [InputTypeEnum.HtmlEditor.toLowerCase()]: TextareaCell,
    [InputTypeEnum.Textarea.toLowerCase()]: TextareaCell,
    [InputTypeEnum.Badges.toLowerCase()]: BadgesCell,
    [InputTypeEnum.Icon.toLowerCase()]: IconCell,
    [InputTypeEnum.Parent.toLowerCase()]: ParentCell,
    [InputTypeEnum.User.toLowerCase()]: UsersCell,
    [InputTypeEnum.Switch.toLowerCase()]: SwitchCell, 
    
    ...[
        InputTypeEnum.Date, InputTypeEnum.Month, InputTypeEnum.Week, InputTypeEnum.Year, 
        InputTypeEnum.Quarter, InputTypeEnum.RangeYear, InputTypeEnum.RangeQuarter, 
        InputTypeEnum.RangeMonth, InputTypeEnum.RangeWeek, InputTypeEnum.RangeDate, 
        InputTypeEnum.RangeDatetimeLocal, InputTypeEnum.DatetimeLocal
    ].reduce((acc, curr) => ({ ...acc, [curr.toLowerCase()]: DateCell }), {}),

    [InputTypeEnum.Time.toLowerCase()]: TimeCell,
    [InputTypeEnum.MultipleTime.toLowerCase()]: TimeCell,

    [InputTypeEnum.QRCode.toLowerCase()]: (p) => (
        <QRCode className={p.colClass} value={p.val} size={100} errorLevel="H" />
    ),
    [InputTypeEnum.Html.toLowerCase()]: (p) => (
        <div className={p.colClass} dangerouslySetInnerHTML={{ __html: p.val }} />
    ),
    [InputTypeEnum.Ratings.toLowerCase()]: (p) => (
        <Rate allowHalf disabled className={p.colClass} defaultValue={Number(p.val)} />
    ),
};