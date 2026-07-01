import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ModalSizeType } from "common/enums/ModalSizeType";
import { DataType } from "common/enums/DataType";
import { TableViewType } from "common/enums/TableViewType";
import { ActiveTab, TabItem } from "./useTabState"; 
import { Actions } from "../components/Actions";
import { formatDate, formatTime } from "helpers/dateHelpers";
import { Datatable } from "common/data/Datatable";
import "../Datatables.css";
import { getTableLabel, getTableRoute, isLockControl } from "common/data/constans";
import useThemeMode from "hooks/useThemeMode";
import { useAuth } from "context/AuthContext";
import { useUserProfile } from "hooks/useUser";

interface UseDatatableColumnsParams {
  handleTableClick: (arg: Datatable, type: DataType) => void;
  handleEditColumnsClick: (arg?: Datatable) => void;
  handleRowsClick: (arg?: Datatable) => void;
  handleRelationClick: (arg?: Datatable) => void;
  handleSettingClick: (arg?: Datatable) => void;
  checkedAll: () => void;
  deleteCheckbox: () => void;
  activeTab: ActiveTab;
  toggleTab: (t: { name: string; id: number }) => void;
  setTabs: React.Dispatch<React.SetStateAction<TabItem[]>>; 
  deleteDatatableById: (id: number) => void;
  backToDelete: (id: number) => void;
  hardDelete: (id: number) => void;
}
export const useDatatableColumns = (p: UseDatatableColumnsParams) =>  { 
  const { isDark } = useThemeMode();
  const { user: usr } = useAuth(); 
  const { data: user } = useUserProfile(usr?.id ?? "");
  const isAdmin = user?.roles?.includes("WG");

  return  useMemo(() => [
    {
      header: (
        <input
          type="checkbox"
          id="checkBoxAll"
          className=""
          onClick={p.checkedAll}
          style={{ 
            width:"16px",height:"16px",
            accentColor: "var(--vz-primary)",
          }}
        />
      ),
      cell: (cell: any) => (
        <input
          type="checkbox"
          className="tableCheckBox"
          value={cell.getValue()}
          onChange={p.deleteCheckbox}
          style={{
            width:"16px",height:"16px",
            accentColor: "var(--vz-primary)",
          }}
        />
      ),
      id: "#",
      accessorKey: "id",
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: "Kimlik (ID)",
      accessorKey: "id",
      enableColumnFilter: false,
      cell: (c: any) => (
        <span className="fw-medium">#{c.getValue()}</span>
      ),
    },
    {
        header: "Tablo Adı",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (c: any) => {
            const { name, id } = c.row.original;
            const locked = isLockControl(name);
            return (
                <>
                    <Link
                        to={getTableRoute(name, id)}
                        target="_blank"
                        className={`col-name-cell link-${isDark ? "light" : "dark"}`}
                    >
                        <span className="text-decoration-underline">{getTableLabel(c.getValue())}</span>
                        {locked && (
                            <i className={`ri-lock-fill text-${isDark ? "light" : "dark"} fs-16 ms-2`} />
                        )}
                    </Link>
                    {" "}
                    <i className={`ri-external-link-line text-${isDark ? "light" : "dark"}`} />
                </>
            );
        },
    },
    {
      header: "Modal Boyutu",
      accessorKey: "modalSize",
      enableColumnFilter: false,
      cell: (c: any) => {
        const v = c.getValue();
        return (
          <div>
            {v === ModalSizeType.Blank ? (
              <i className="text-primary fs-2 bx bx-windows" />
            ) : v === ModalSizeType.Overlay ? (
              <i className="text-primary fs-2 bx bx-window" />
            ) : (
              <i className="text-primary fs-2 bx bx-window">
                <span className="size-text">{v}</span>
              </i>
            )}
          </div>
        );
      },
    },
    {
      header: "Görünüm Türü",
      accessorKey: "viewType",
      enableColumnFilter: false,
      cell: (c: any) => (
        <div className="btn btn-sm btn-soft-primary">
          {c.getValue() === TableViewType.Grid
            ? <i className="text-primary fs-5 bx bx-grid-alt" />
            : <i className="text-primary fs-5 ri-list-check" />
          }
        </div>
      ),
    },
    {
      header: "Sayfa Boyutu",
      accessorKey: "pageSize",
      enableColumnFilter: false,
      cell: (c: any) => <div>{c.getValue()}</div>,
    },
    {
      header: "Oluşturulma Tarihi",
      accessorKey: "createdAt",
      enableColumnFilter: false,
      cell: (c: any) => (
        <div style={{ maxWidth: "140px" }}>
          {formatDate(c.getValue())},
          <small className="text-muted"> {formatTime(c.getValue())}</small>
        </div>
      ),
    },
    {
      id: "action",
      header: "İşlemler",
      cell: (c: any) => (
        <Actions
          handleTableClick={p.handleTableClick}
          handleEditColumnsClick={p.handleEditColumnsClick}
          handleRowsClick={p.handleRowsClick}
          handleRelationClick={p.handleRelationClick}
          handleSettingClick={p.handleSettingClick}
          cellProps={c}
          toggleTab={p.toggleTab}
          setTabs={p.setTabs}
          deleteDatatable={p.deleteDatatableById}
          isAllDatas={p.activeTab.name === "Tablolar"}
          backToDelete={p.backToDelete}
          hardDelete={p.hardDelete}
          isLock={isLockControl(c.row.original.name)}
        />
      ),
    },
  ], [p.handleTableClick, p.handleEditColumnsClick, p.handleRelationClick,
      p.handleSettingClick, p.checkedAll, p.activeTab, isDark]);
}