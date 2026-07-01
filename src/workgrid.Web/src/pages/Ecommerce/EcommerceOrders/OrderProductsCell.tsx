import { IProduct } from "common/data/ecommerce";
import { IParsedItem, resolveImg } from ".";
import { useState } from "react";
import { Link } from "react-router-dom";

export const OrderProductsCell: React.FC<{
    items: IParsedItem[];
    productById: Record<number, Pick<IProduct, "id" | "name" | "mainImage">>;
}> = ({ items, productById }) => {
    const [idx, setIdx] = useState(0);

    if (items.length === 0) return <span className="text-muted">—</span>;

    const safeIdx = Math.min(idx, items.length - 1);
    const current = items[safeIdx];
    const product = current.productId ? productById[Number(current.productId)] : undefined;
    const img = resolveImg(product?.mainImage);
    const hasMany = items.length > 1;

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx((i) => (i - 1 + items.length) % items.length);
    };
    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx((i) => (i + 1) % items.length);
    };

    return (
        <div className="d-flex align-items-center gap-1" style={{ minWidth: 230 }}>
        
            <button
            type="button"
            className="btn btn-icon btn-sm btn-ghost-secondary p-0 flex-shrink-0"
            onClick={(e)=>{
                if(hasMany) prev(e);
            }}
            title="Önceki ürün"
            style={{ width: 22, height: 22 }}
            >
            <i className="ri-arrow-left-s-line fs-18" />
            </button>
        

        <div className="d-flex align-items-center gap-2 flex-grow-1 overflow-hidden">
            <div className="avatar-xs bg-light rounded flex-shrink-0"  style={{ height: "60px",  width: "90px" }}>
            <img
                src={img}
                alt=""
                className="img-fluid rounded"
                style={{ height: "100%", objectFit: "cover" }}
                onError={(e) => {
                e.currentTarget.src = "https://dummyimage.com/100x100/F3F6F9/969696.jpg";
                e.currentTarget.onerror = null;
                }}
            />
            </div>
            <div className="text-truncate" style={{ maxWidth: 140 }}>
            <Link to={"/product-detail/"+current.productId}>
                <span className="text-truncate d-block text-primary">{current.name ?? "Ürün"}</span>
            </Link>
            {hasMany && (
                <small className="text-muted">{safeIdx + 1} / {items.length}</small>
            )}
            </div>
        </div>

            <button
            type="button"
            className="btn btn-icon btn-sm btn-ghost-secondary p-0 flex-shrink-0"
            onClick={(e)=>{
                if(hasMany) next(e);
            }}
            title="Sonraki ürün"
            style={{ width: 22, height: 22 }}
            >
            <i className="ri-arrow-right-s-line fs-18" />
            </button>
        </div>
    );
};