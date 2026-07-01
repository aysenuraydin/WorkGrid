export const ErrorState = ({ message = "Veriler yüklenirken bir hata oluştu." }: { message?: string }) => (
    <div className="alert alert-danger d-flex align-items-center gap-2">
        <i className="ri-error-warning-line fs-18" />
        <span>{message}</span>
    </div>
);