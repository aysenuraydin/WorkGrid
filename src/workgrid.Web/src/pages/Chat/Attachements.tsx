import { Link } from "react-router-dom";
import { 
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap"; 

export const Attachements = (props:any) => {
    return (
        <div className="border rounded border-dashed p-2">
        <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
            <div className="avatar-xs">
                <div className="avatar-title bg-light text-secondary rounded fs-20">
                <i className={props.attachement.foldericon}></i>
                </div>
            </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
            <h5 className="fs-13 mb-1">
                <Link to="#" className="text-body text-truncate d-block">
                {props.attachement.foldername}
                </Link>
            </h5>
            <div className="text-muted">{props.attachement.foldersize}</div>
            </div>
            <div className="flex-shrink-0 ms-2">
            <div className="d-flex gap-1">
                <button
                type="button"
                className="btn btn-icon text-muted btn-sm fs-18"
                >
                <i className="ri-download-2-line"></i>
                </button>
                <UncontrolledDropdown>
                <DropdownToggle
                    tag="button"
                    className="btn btn-icon text-muted btn-sm fs-18 dropdown"
                >
                    <i className="ri-more-fill"></i>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>
                        <i className="ri-share-line align-bottom me-2 text-muted"></i>{" "}
                        Paylaş
                    </DropdownItem>
                    <DropdownItem>
                        <i className="ri-bookmark-line align-bottom me-2 text-muted"></i>{" "}
                        Yer İşareti Ekle
                    </DropdownItem>
                    <DropdownItem className="text-danger">
                        <i className="ri-delete-bin-line align-bottom me-2 text-danger"></i>{" "}
                        Sil
                    </DropdownItem>
                </DropdownMenu>
                </UncontrolledDropdown>
            </div>
            </div>
        </div>
        </div>
    );
};