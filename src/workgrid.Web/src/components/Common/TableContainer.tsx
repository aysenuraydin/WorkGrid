import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Alert, Card, CardBody, CardHeader, Col, PopoverBody, PopoverHeader, Row, Table, UncontrolledPopover } from "reactstrap";
import { Tooltip } from 'react-tooltip'
import { Link } from "react-router-dom";

import {
  Column,
  Table as ReactTable,
  ColumnFiltersState,
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';
import Flatpickr from "react-flatpickr";
import moment from "moment";
import Select from "react-select"; 

import { Popover as AntPopover } from 'antd';
import { useGetDataTables } from "hooks/useDatatables";
import { useDatatableFilteredCells } from "hooks/useTableCells";
import { toSafeId } from "common/utils/stringUtils";
import { getPopoverContent } from "./getPopoverContent";
import { Datatable } from "common/data/Datatable";
import { TableColumn } from "common/data/TableColumn";
import { TableRow } from "common/data/TableRow";
import { TableCell } from "common/data/TableCell";
import { useGetTenantConfig } from "hooks/useTenant";
import useThemeMode from "hooks/useThemeMode";
// import fileImg from "../../assets/images/file.png";
// Column Filter
const Filter = ({
  column
}: {
  column: Column<any, unknown>;
  table: ReactTable<any>;
}) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input {...props} value={value} id="search-bar-0" className="form-control search" onChange={e => setValue(e.target.value)} />
  );
};

interface TableContainerProps {
  columns?: any;
  data?: any;
  handleTaskClick?: any;
  customPageSize?: any;
  tableClass?: any;
  theadClass?: any;
  trClass?: any;
  thClass?: any;
  divClass?: any;
  SearchPlaceholder?: any;
  handleLeadClick?: any;
  handleCompanyClick?: any;
  handleContactClick?: any;
  handleTicketClick?: any;
  children?: React.ReactNode;

  isGlobalFilter?: any;
  isIcon?:boolean;
  isTableFilter?:boolean;
  filterColumns?:TableColumn[];
  tbl?:Datatable;
  rows?:TableRow [];

  tableName?:string;
  h?:string;

  // Dışarıdan (örn. route ?q=) gelen başlangıç arama metni
  initialGlobalFilter?: string;
}

const TableContainer = ({
  columns,
  data,
  rows,
  tableName,
  h,
  isIcon,
  isGlobalFilter,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  children,
  filterColumns,
  isTableFilter,
  tbl,
  initialGlobalFilter,
}: TableContainerProps) => {
  const { data: tenantConfig, } = useGetTenantConfig(); 
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter ?? '');

  // Route'tan gelen arama metni değişirse global filtreyi senkronla
  useEffect(() => {
    setGlobalFilter(initialGlobalFilter ?? '');
    if (initialGlobalFilter) setChanged(true);
  }, [initialGlobalFilter]);

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank
    });
    return itemRank.passed;
  };

  const getRemainingDays = (deletedAt: string) => {
    const deletedDate = moment.utc(deletedAt).startOf("day");
    const today = moment.utc().startOf("day");

    const passedDays = today.diff(deletedDate, "days");
    const remaining = 30 - passedDays;

    return remaining > 0 ? remaining : 0;
  };

  const enrichedData = useMemo(() => {
    if(data?.[0]?.deletedAt || (rows && rows?.[0]?.deletedAt)) {
      return data.map((item: any) => {
          return {
            ...item,
            remainingDays: getRemainingDays(rows?.find(x=>x.id==item.id)?.deletedAt)
          };
      });
    } else return data
  }, [data]);

  const remainingDaysColumn = {
    accessorKey: "remainingDays",
    enableColumnFilter: false,
    id: "remainingDays",
    header: "Remaining Days",
    cell: ({ getValue }: any) => {
      const val = getValue();
      if (val == null) return "-";
      return (
        <span className={`badge bg-${val <= 10 ? "danger" : "warning"}`}>
          + {val} day
        </span>
      );
    },
  };

  const finalColumns = useMemo(() => {
    if (!columns || columns?.length === 0) return [];

    const hasDeletedAt =
      data?.some((x: any) => x?.deletedAt) ||
      rows?.some((x: any) => x?.deletedAt);

    if (!hasDeletedAt) return columns;

    const alreadyExists = columns.some(
      (c: any) =>
        c.accessorKey === "remainingDays" || c.id === "remainingDays"
    );

    if (alreadyExists) return columns;

    const cols = [...columns];  

    const insertIndex = Math.max(cols?.length - 1, 0);  

    cols.splice(insertIndex, 0, remainingDaysColumn);

    return cols;
  }, [columns, data, rows]);

  const multiSelectFilter: FilterFn<any> = (
    row,
    columnId,
    filterValue: any[]
  ) => {
    if (!filterValue || filterValue?.length === 0) return true;

    const cellValue = row.getValue(columnId);

    return filterValue.includes(cellValue);
  };

  const table = useReactTable({
    columns:finalColumns,
    data :enrichedData,
    filterFns: {
      multi: multiSelectFilter,
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    nextPage,
    previousPage,
    setPageSize,
    getState
  } = table;

  useEffect(() => {
    Number(customPageSize) && setPageSize(Number(customPageSize));
  }, [customPageSize, setPageSize]);

  const [tables, setTables] = useState<{ [tableId: number]: Datatable }>({});
  const [selectedFilters, setSelectedFilters] = useState<{
    [columnId: number]: { label: string; value: any }[];
  }>({});
  const [isChanged, setChanged] = useState<boolean>(false);

  const { data: Datatables, isLoading: isTablesLoading, error:tablesError } = useGetDataTables();  
  const { data: columnCells, isLoading, error } = useDatatableFilteredCells(tbl?.id ?? 0);

  const cells = useMemo(() => { 
    // console.log("columnCells",columnCells)
      if (!columnCells || !columnCells.data) {
          return {};
      }

      return columnCells.data.reduce((acc, item) => {
          acc[item.columnId] = item.cellsFk;
          return acc;
      }, {} as { [columnId: number]: TableCell[] });
  }, [columnCells]);

  const neededTableIds = useMemo(() => {
    return Array.from(
      new Set(
        (filterColumns ?? [])
          .filter(c => c.realTableId)
          .map(c => c.realTableId!)
      )
    );
  }, [filterColumns]);

  useEffect(() => {
    if (!Datatables?.data || Datatables?.data.length === 0) return;

    const filteredTables: { [tableId: number]: Datatable } = {};

    for (const tbl of Datatables?.data) {
      if (neededTableIds.includes(tbl.id)) {
        filteredTables[tbl.id] = tbl;
      }
    }

    setTables(filteredTables);
  }, [Datatables, neededTableIds]);
  
  const getOptions = React.useCallback((cs: TableCell[], isForegnColumn: boolean) => {
    if (!cs || cs.length === 0) return [];

    const uniqueOptionsMap = new Map();

    cs.forEach(c => {
      const key = isForegnColumn ? String(c.rowId) : c.value;
      
      if (!uniqueOptionsMap.has(key)) {
        uniqueOptionsMap.set(key, {
          label: c.value, 
          value: key,     
        });
      }
    });

    return Array.from(uniqueOptionsMap.values()).sort((a: any, b: any) => 
      String(a.label).localeCompare(String(b.label), 'tr', { sensitivity: 'base' })
    );
  }, [cells]);
  
  const ResetFilters = () => {
    setSelectedFilters({});
    setGlobalFilter("");
    setColumnFilters([]); 
    setChanged(false);
  };

  const safeName = useMemo(() => 
      toSafeId([tbl?.id, tbl?.name], "t"), 
  [tbl?.id, tbl?.name]);
  const { isDark } = useThemeMode();  
  return (
    <Fragment>
      {isGlobalFilter && <Row className="mb-3">
        <CardBody className="border border-dashed border-end-0 border-start-0">
            <Row>
              <Col sm={4} className=" ">
                <div className={"search-box me-2 mb-2 d-inline-block w-100 rounded"}>
                  <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={(value) => {
                      if (String(value) !== globalFilter) {
                        setGlobalFilter(String(value));
                        setChanged(true);
                      }
                    }}
                    placeholder={SearchPlaceholder}
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </Col>
              <Col sm={8} className=" ">
                  <Row className=''>
                    { filterColumns && 
                        (filterColumns ?? [])
                        ?.filter((col:TableColumn)=>col.isFilter)
                        ?.map((c:TableColumn)=> {
                          const colId = c.realColumnId  ? c.realColumnId  : c.id
                          return(
                            <Col sm={Math.floor(10/filterColumns?.length)} key={c.id}>
                                <Select
                                    isMulti
                                    placeholder={ c?.realTableId  
                                      ? `${tables[c?.realTableId ]?.name} ${c.name}` 
                                      : `${c.name}`
                                    }
                                    value={selectedFilters[colId] ?? []}

                                    onChange={(selected:any) => {
                                      const values = selected?.map((s: any) => s.value) ?? [];
                                      const columnKey = `${safeName}-col-${c.id}`;

                                      setSelectedFilters(prev => ({
                                        ...prev,
                                        [colId]: selected ?? []
                                      }));

                                      setColumnFilters((prev:any )=> {
                                        const others = prev.filter((f:any) => f.id !== String(columnKey));
                                        if (values?.length === 0) return others;
                                        return [
                                          ...others,
                                          {
                                            id: columnKey,
                                            value: values,
                                          }
                                        ];
                                      });
                                      setChanged(true);
                                    }}
                                    options={getOptions(cells[colId] ?? [], c.realColumnId!=null)}
                                    name={"nameStatus"+c.id}
                                    id={"idStatus"+c.id} 
                                    styles={{
                                      control: (base: any, state: any) => ({
                                      ...base,
                                      backgroundColor: base.backgroundColor,
                                      borderColor: state.isFocused ? 'var(--vz-primary)' : base.borderColor,  
                                      boxShadow: state.isFocused ? '0 0 0 1px #00000000' : base.boxShadow, 
                                      '&:hover': {
                                          borderColor: 'var(--vz-primary)', 
                                      },
                                      }),
                                      option: (base: any, state: any) => ({
                                      ...base,
                                      backgroundColor: state.isSelected
                                          ? 'var(--vz-primary)'
                                          : state.isFocused
                                          ? 'rgba(var(--vz-primary-rgb), 0.1)'
                                          : 'white',
                                      color: state.isSelected ? 'white' : '#2c2c2c',
                                      cursor: 'pointer',
                                      }),
                                      multiValue: (base: any) => ({
                                      ...base,
                                      backgroundColor: 'var(--vz-primary)',
                                      color: 'rgba(var(--vz-primary-rgb), 0.4)',
                                      }),
                                      multiValueLabel: (base: any) => ({
                                      ...base,
                                      color: 'rgba(var(--vz-primary-rgb), 0.1)',
                                      fontWeight: 500,
                                      }),
                                      multiValueRemove: (base: any) => ({
                                      ...base,
                                      color: 'rgba(var(--vz-primary-rgb), 0.2)',
                                      ':hover': {
                                          backgroundColor: 'var(--vz-primary)',
                                          color: 'white',
                                      },
                                      }),
                                  }}
                                ></Select>
                            </Col>
                        )
                        })
                    }
                    {isTableFilter &&
                      <Col>
                          <Flatpickr
                              className="form-control"
                              id="datepicker-publish-input"
                              placeholder="Select a date"
                              options={{
                                  altInput: true,
                                  altFormat: "F j, Y",
                                  mode: "multiple",
                                  dateFormat: "d.m.y",
                              }}
                          />
                      </Col>
                    }
                    <Col sm={2}>
                        <div>
                            {isChanged 
                            ?  <button onClick={()=>ResetFilters()} type="button" className="btn btn-primary w-100 overflow-hidden"
                            style={{height:"38px", minWidth:"90px"}}>
                                {" "}
                                <i className=" ri-refresh-line me-1 align-bottom"></i>
                                Resetle
                            </button>
                            : <button type="button" className="btn btn-primary w-100 overflow-hidden" style={{height:"38px", minWidth:"90px"}}>
                                    {" "}
                                    <i className="ri-equalizer-fill me-1 align-bottom"></i>
                                    Filtrele
                              </button>
                            }
                        </div>
                    </Col>
                </Row>
              </Col>
            </Row>
        </CardBody>
      </Row>}

      <div className={`${divClass}`} style={{...(h ? {height:h} : {minHeight:"50vh"}), padding:"15px" }}>

        {!!isIcon && (
          <div className="p-5">
            <Row className="d-flex g-5">
              {getRowModel()?.rows?.map((row: any) => {
                const rowItem = row.original;
                const baseName = tableName ? tableName.toLowerCase().replace(/\s+/g, "-") : "grid";
                const gridPopoverId = `grid-${baseName}-popover-${rowItem.id}`;
                  const rowData = rows ? rows.find((x: any) => x.id === row.original.id) : row.original;

                return ( 
                  <Col key={row.id} md={6} xl={4} xxl={3} className="d-flex">
                    <AntPopover 
                      content={getPopoverContent(rowData)} 
                      title={null} 
                      trigger="hover" 
                      placement="topRight"
                      mouseEnterDelay={2}  
                      overlayStyle={{ maxWidth: '300px',  zIndex: 9999  }}
                      >
                    <div style={{ width: '100%' }}>
                    <Card
                      className={`bg-${isDark?'soft-':''}white w-100 shadow h-100 border`}
                      id={gridPopoverId}
                      style={{ maxWidth: "350px" }}
                    >
                      <CardHeader className="p-3">
                        <div className="d-flex gap-2">
                          {flexRender(
                            row.getVisibleCells().find((c: any) => c.column.id === "checkbox")?.column.columnDef.cell,
                            row.getVisibleCells().find((c: any) => c.column.id === "checkbox")?.getContext()
                          )}
                          <h6 className="card-title mb-0">
                            Id: <span className="text-primary">#{rowItem.id}</span>
                          </h6>
                        </div>
                      </CardHeader>

                      <CardBody>
                        {row.getVisibleCells().map((cell: any) => {
                          const column = cell.column.columnDef;
                          const colId = cell.column.id;

                          if (colId === "checkbox" || colId === "id" || colId === "action-row")     return null;

                          const actualColId = colId.split("-col-").pop();

                          return (
                            <p key={cell.id} className="card-text fs-6 text-capitalize" data-col-id={`${safeName}-col-${actualColId}`}>
                              <strong className="me-2" style={{ letterSpacing: "0.08em" }}>
                                {typeof column.header === 'function' ? column.header() : column.header}:
                              </strong>
                              <div className="d-inline-block">
                                {flexRender(column.cell, cell.getContext())}
                              </div>
                            </p>
                          );
                        })}
                      </CardBody>

                      <div className="card-footer p-2">
                        <div className="">
                          {flexRender(
                            row.getVisibleCells().find((c: any) => c.column.id === "action-row")?.column.columnDef.cell,
                            row.getVisibleCells().find((c: any) => c.column.id === "action-row")?.getContext()
                          )}
                        </div>
                      </div>
                    </Card>
                    </div> 
                    </AntPopover>
                  </Col>
                );
              })}
              {!(getRowModel()?.rows?.length>0) &&
                  <div className="tasks noTask">
                    {/* <img src={fileImg} width="50%" /> */} 
                    {/* sınıf ile fileImg i verdik */}
                  </div>
              }
            </Row>
          </div>
        )}
        
        {!!isIcon == false &&
          <Table hover className={`${tableClass}`}>
            <thead className={theadClass}>
              {getHeaderGroups().map((headerGroup: any) => (
                <tr className={trClass} key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => (
                    <th key={header.id} className={thClass}  {...{
                      onClick: header.column.getToggleSortingHandler(),
                    }}>
                      {header.isPlaceholder ? null : (
                        <React.Fragment>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' ',
                            desc: ' ',
                          }
                          [header.column.getIsSorted() as string] ?? null}
                          {header.column.getCanFilter() ? (
                              <Filter column={header.column} table={table} />
                          ) : null}
                        </React.Fragment>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="">
              {children}
              {((data?.length == 0 && children !=null) || columns?.length == 0 || (rows && rows?.length == 0)) && (
                <tr style={{height:"30px"}}  className="p-0">
                  <td colSpan={columns?.length} style={{height:"30px"}}>
                    <Alert color="danger" isOpen  className="m-0 p-3 w-100">
                      {tbl?.name ?? "Data"} verileri bulunamadı ! 
                    </Alert>
                  </td>
                </tr>
              )}  
              {getRowModel()?.rows?.map((row: any) => {
                const rowId = `${row?.name ?? "row"}-${row.id}`; 
                const baseName = tableName ? tableName.toLowerCase().replace(/\s+/g, "-") : "table";
                const tablePopoverId = `table-${baseName}-popover-${row.id}`;
                const rowData = rows ? rows.find((x: any) => x.id === row.original.id) : row.original;

                return (
                  <AntPopover 
                      key={row.id}
                      content={getPopoverContent(rowData)} 
                      title={null} 
                      trigger="hover" 
                      placement="topRight"
                      mouseEnterDelay={2}  
                      overlayStyle={{ maxWidth: '300px',  zIndex: 9999  }}
                      >
                  <tr key={row.id}
                    id={tablePopoverId}
                    data-tooltip-id={rowId} >
                    {row.getVisibleCells().map((cell: any) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })} 
                  </tr>
                  </AntPopover>
                );
              })}
            </tbody>
          </Table>
        }
      </div>

      <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
        <div className="col-sm">
          <div className="text-muted">Showing<span className="fw-semibold ms-1">{getState().pagination.pageSize}</span> of <span className="fw-semibold">{data?.length}</span> Results
          </div>
        </div>
        <div className="col-sm-auto">
          <ul className="pagination pagination-primary  pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
            <li className={!getCanPreviousPage() ? "page-item disabled" : "page-item"}>
              <Link to="#" className="page-link link-primary" onClick={previousPage}>Önceki</Link>
            </li>
            {getPageOptions().map((item: any, key: number) => (
              <React.Fragment key={key}>
                <li className="page-item">
                  {/* <Link to="#" className={getState().pagination.pageIndex === item ? "page-link active" : "page-link"} onClick={() => setPageIndex(item)}>{item + 1}</Link> */}


                <Link 
                  to="#" 
                  className={`page-link ${getState().pagination.pageIndex === item ? "active" : ""}`} 
                  onClick={() => setPageIndex(item)}
                  style={getState().pagination.pageIndex === item ? {
                      backgroundColor: "var(--vz-primary)", 
                      borderColor: "var(--vz-primary)", 
                  } : {}}
              >
                  <span style={{color: getState().pagination.pageIndex !== item ? "var(--vz-primary)" :"#fff"}}>{item + 1}</span>
              </Link>
              </li>
              </React.Fragment>
            ))}
            <li className={!getCanNextPage() ? "page-item disabled" : "page-item"}>
              <Link to="#" className="page-link link-primary" onClick={nextPage}>Sonraki</Link>
            </li>
          </ul>
        </div>
      </Row>
    </Fragment>
  );
};

export default TableContainer;