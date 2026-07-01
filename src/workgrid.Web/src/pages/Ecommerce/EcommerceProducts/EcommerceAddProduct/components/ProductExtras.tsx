import { Card, CardBody, CardHeader, Input } from "reactstrap";
import { IconPicker } from "components/Common/Iconpicker";
import { ExtraRow } from "../hooks/useProductForm";

interface Props {
  title: string;
  icon: string;
  rows: ExtraRow[];
  placeholder: string;
  emptyText: string;
  onAdd: () => void;
  onUpdate: (localId: string, field: keyof ExtraRow, value: any) => void;
  onRemove: (localId: string, dbId?: number) => void;
}

export const ProductExtras = ({ title, icon, rows, placeholder, emptyText, onAdd, onUpdate, onRemove }: Props) => (
  <Card className="border border-2">
    <CardHeader>
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0"><i className={`${icon} me-1 text-muted`} />{title}</h5>
        <button type="button" className="btn btn-soft-success btn-sm" onClick={onAdd}>
          <i className="ri-add-line align-bottom me-1" /> Ekle
        </button>
      </div>
    </CardHeader>
    <CardBody>
      {rows.length === 0 ? (
        <div className="text-center py-3 text-muted fs-13">
          <i className={`${icon} fs-24 d-block mb-1`} />{emptyText}
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {rows.map((row, index) => {
            // inline hata: deger bos ise uyari
            const showError = row.value.trim() === "";
            return (
              <div key={row.localId}>
                <div className="d-flex align-items-center gap-2 p-2 border rounded bg-light">
                  <span className="text-muted fs-12 fw-medium" style={{ minWidth: 20 }}>{index + 1}.</span>
                  <IconPicker value={row.icon || "ri-checkbox-blank-circle-line"}
                    onChange={(ic) => onUpdate(row.localId, "icon", ic)} />
                  <Input bsSize="sm" className="flex-grow-1" placeholder={placeholder}
                    value={row.value} onChange={(e) => onUpdate(row.localId, "value", e.target.value)}
                    invalid={showError} />
                  <Input type="number" bsSize="sm" style={{ width: 70 }} title="Sıra"
                    value={row.order} onChange={(e) => onUpdate(row.localId, "order", Number(e.target.value))} />
                  <button type="button" className="btn btn-sm btn-soft-danger flex-shrink-0"
                    onClick={() => onRemove(row.localId, row.id)}>
                    <i className="ri-delete-bin-line" />
                  </button>
                </div>
                {showError && <div className="text-danger fs-12 mt-1 ms-4">Değer boş olamaz.</div>}
              </div>
            );
          })}
        </div>
      )}
    </CardBody>
  </Card>
);