import React from "react";
import { Button, Spinner, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import { SectionHead } from "pages/Tenant/Components/SectionHead";

interface FormActionsTopProps {
    isSubmitting: boolean;
    isSaving: boolean;
    saveSuccess: boolean;
    onReset: () => void;
}

export const FormActionsTop: React.FC<FormActionsTopProps> = ({
    isSubmitting,
    isSaving,
    saveSuccess,
    onReset,
}) => (
    <>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <SectionHead
                icon="ri-palette-line"
                title="WorkGrid — Tenant Ayarları"
                subtitle="Tema, logo ve modül yapılandırması"
            />
            <div className="d-flex gap-2">
                <Button
                    type="button"
                    color="light"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={onReset}
                >
                    <i className="ri-arrow-go-back-line me-1" />Geri Al
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    size="sm"
                    disabled={isSubmitting || isSaving}
                >
                    {isSubmitting || isSaving ? (
                        <><Spinner size="sm" className="me-1" />Kaydediliyor…</>
                    ) : (
                        <><i className="ri-save-3-line me-1" />Kaydet</>
                    )}
                </Button>
            </div>
        </div>

        {saveSuccess && (
            <Alert color="success" className="py-2 px-3 fs-13 mb-3">
                <i className="ri-check-double-line me-1" />Yapılandırma başarıyla kaydedildi.
            </Alert>
        )}
    </>
);

interface FormActionsBottomProps {
    isSubmitting: boolean;
    isSaving: boolean;
    onReset: () => void;
    onRevert: () => void;
}

export const FormActionsBottom: React.FC<FormActionsBottomProps> = ({
    isSubmitting,
    isSaving,
    onReset,
    onRevert,
}) => (
    <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
        <Link to="" className="mt-2 link-primary" onClick={onReset}>
            <i className="ri-alert-line me-2" />Sıfırla
        </Link>
        <Button
            type="button"
            color="light"
            disabled={isSubmitting || isSaving}
            onClick={onRevert}
        >
            <i className="ri-arrow-go-back-line me-1" />Geri Al
        </Button>
        <Button type="submit" color="primary" disabled={isSubmitting || isSaving}>
            {isSubmitting || isSaving ? (
                <><Spinner size="sm" className="me-1" />Kaydediliyor…</>
            ) : (
                <><i className="ri-save-3-line me-1" />Değişiklikleri Kaydet</>
            )}
        </Button>
    </div>
);