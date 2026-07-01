import { TableColumn } from 'common/data/TableColumn';
import { ModalType } from 'common/enums/ModalType';
import { DeletedTableColumn } from 'components/Common/interfaces/TableColumnContextType';
import { PopConfirm } from 'components/Common/PopConfirm';
import { useTableColumn } from 'context/TableColumnContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Alert, Input } from 'reactstrap';

export const DeletedColumns = ({ }) => {
    const {
        deletedColumns,
        hardDeleteTableColumn,
        backToDeleteColumn,
    } = useTableColumn();

    const delCols = deletedColumns?.filter(x => !x.isBackDeleted && !x?.isHardDelete);

    const getDaysDiff = (deletedAt: string): number => {
        if (!deletedAt || deletedAt === "") return 30;

        const deletedDate = new Date(deletedAt);
        const today = new Date();

        deletedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffInMs = today.getTime() - deletedDate.getTime();
        const passedDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        const remainingDays = 30 - passedDays;

        return remainingDays < 0 ? 0 : remainingDays;
    };

    return (
        <div className="table-wrapper scroll-body">
            <table className="position-relative table align-middle table-nowrap table-striped-columns mb-0">
                <thead className="table-light text-muted text-uppercase sticky-header position-sticky top-0">
                    <tr>
                        <th scope="col" style={{ width: "68px" }}>Sütun No</th>
                        <th scope="col">Sütun Adı</th>
                        <th scope="col" style={{ width: "130px" }}>Veri Tipi</th>
                        <th scope="col" className="last-column">Görünür</th>
                        <th scope="col" className="last-column">Filtre</th>
                        <th scope="col" className="last-column">Kalan Gün</th>
                        <th style={{ width: "85px" }}></th>
                    </tr>
                </thead>
                <tbody className="mt-5">
                    {delCols?.length > 0 && delCols
                        .map((column: TableColumn & { isBackDeleted: boolean, isHardDelete: boolean, deletedAt: string }) => {
                            const daysDiff = getDaysDiff(column?.deletedAt ?? "");
                            return (
                                <tr key={column.id}>
                                    <td className="text-primary">
                                        <span>#{column.id}</span>
                                    </td>
                                    <td>{column.name}</td>
                                    <td>{column.type}</td>
                                    <td className='text-center'>
                                        <Input
                                            name="isVisible"
                                            type="checkbox"
                                            className="form-check-input"
                                            style={{ width: '20px', height: '20px' }}
                                            checked={column.isVisible}
                                            readOnly
                                        />
                                    </td>
                                    <td className='text-center'>
                                        <Input
                                            name="isFilter"
                                            type="checkbox"
                                            className="form-check-input"
                                            style={{ width: '20px', height: '20px' }}
                                            checked={column.isFilter}
                                            readOnly
                                        />
                                    </td>
                                    <td className='text-center'>
                                        <span className={`badge bg-${daysDiff <= 10 ? "danger" : daysDiff <= 20 ? "warning" : "warning"}`}>
                                            + {daysDiff} gün <br />
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="list-inline-item">
                                            <Link to="#" id={`recover-popconfirm-${column?.id}`} className="btn btn-sm btn-soft-primary me-1">
                                                <i className="ri-arrow-go-back-fill fs-14 text-primary"></i>
                                            </Link>
                                            <PopConfirm
                                                targetId={`recover-popconfirm-${column?.id}`}
                                                type={ModalType.Confirm}
                                                message='Bu kaydı geri yüklemek istediğinizden emin misiniz?'
                                                confirmText='Geri Yükle'
                                                onConfirm={async () => await backToDeleteColumn(column)}
                                                onClose={() => toast.warning("Geri yüklenemedi!")}
                                            />
                                            <Link to="#" id={`deleted-popconfirm-${column?.id}`} className="btn btn-sm btn-soft-danger">
                                                <i className="ri-delete-bin-5-fill fs-14 text-danger"></i>
                                            </Link>
                                            <PopConfirm
                                                targetId={`deleted-popconfirm-${column?.id}`}
                                                type={ModalType.Alert}
                                                message='Bu kaydı kalıcı olarak silmek istediğinizden emin misiniz?'
                                                confirmText='Sil'
                                                onConfirm={async () => await hardDeleteTableColumn(column)}
                                                onClose={() => toast.warning("Silinemedi!")}
                                            />
                                        </div>
                                    </td>
                                    <style>{`
                                        .my-inner-border {
                                            box-sizing: border-box; 
                                            box-shadow: inset 0 0 0 2px rgba(var(--vz-primary-rgb), 0.2);
                                            border: 1.3px solid rgba(var(--vz-primary-rgb), 0.56);
                                        }
                                    `}</style>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {delCols?.length === 0 && (
                <Alert color="danger" isOpen={true} className="p-3 my-3">
                    Silinen sütun bulunamadı!
                </Alert>
            )}
        </div>
    )
}