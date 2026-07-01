import { useMenu } from "context/MenuContext";
import "../MenuItems.css";
interface DoMoveProps {
    id: number;
    left?: string;
    top?: string; 
}
export const DoMove = ({ id, left = "-60px", top = "-3px" }: DoMoveProps) => {
    const { moveUp, moveDown } = useMenu();
    return(
        <span style={{ position: "absolute", left, top }}>
            <i
                style={{ lineHeight: "13px" }}
                className="d-block ri-arrow-up-s-line align-middle fs-16 hoverArrow"
                onClick={() => moveUp(id)}
            />
            <i
                style={{ lineHeight: "13px" }}
                className="d-block ri-arrow-down-s-line align-middle fs-16 hoverArrow"
                onClick={() => moveDown(id)}
            />
        </span>
    )
}; 