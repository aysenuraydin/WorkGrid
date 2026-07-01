import { Button, Spinner } from "reactstrap";

/** Kaydet butonu */
export const SaveButton = ({ onClick, isSaving }: { onClick: () => void; isSaving: boolean }) => (
    <div className="d-flex justify-content-end mt-4 pt-3 border-top">
        <Button color="primary" onClick={onClick} disabled={isSaving}>
            {isSaving ? (
                <><Spinner size="sm" className="me-1" />Kaydediliyor...</>
            ) : (
                <><i className="ri-save-3-line me-1" />Değişiklikleri Kaydet</>
            )}
        </Button>
    </div>
);