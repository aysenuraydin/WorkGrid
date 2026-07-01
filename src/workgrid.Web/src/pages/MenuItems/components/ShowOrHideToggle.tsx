import "../MenuItems.css";

interface ShowOrHideToggleProps {
    onClick: () => void;
    isOpen: boolean;
}

export const ShowOrHideToggle = ({ onClick, isOpen }: ShowOrHideToggleProps) => (
    <div 
        className="showOrHide" 
        onClick={onClick} 
        role="button" 
        aria-label={isOpen ? "Menüyü Daralt" : "Menüyü Genişlet"}
        style={{ cursor: 'pointer', display: 'inline-block' }}
    >
        {isOpen ? (
            <i 
                style={{ color: "#00000070" }} 
                className="fs-15 ri-checkbox-indeterminate-line" 
                title="Daralt"
            />
        ) : (
            <i 
                style={{ color: "#00000070" }} 
                className="fs-15 ri-add-box-line" 
                title="Genişlet"
            />
        )}
    </div>
);