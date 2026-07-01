import { useState, useCallback, useEffect } from "react";
import { Datatable } from "common/data/Datatable";
import { DataType } from "common/enums/DataType";

export const useModalState = () => {
  const [table, setTable] = useState<Datatable | undefined>();
  const [modalType, setModalType] = useState<DataType>(DataType.Create);
  const [modal, setModal] = useState(false);
  const [editColumnModal, setEditColumnModal] = useState(false);
  const [editRelationModal, setEditRelationModal] = useState(false);
  const [editSettingModal, setEditSettingModal] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (modal) setModal(false);
      if (editSettingModal) setEditSettingModal(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [modal, editSettingModal]);

  const tableToggle = useCallback(() => setModal(p => !p), []);

  const columnToggle = useCallback(() => {
    if (editColumnModal) {
      setEditColumnModal(false);
      setEditRelationModal(false);
      setEditSettingModal(false);
      setTable(undefined);
    } else {
      setEditColumnModal(true);
    }
  }, [editColumnModal]);

  const relationToggle = useCallback(() => {
    if (editRelationModal) {
      setEditColumnModal(false);
      setEditRelationModal(false);
      setEditSettingModal(false);
      setTable(undefined);
    } else {
      setEditRelationModal(true);
    }
  }, [editRelationModal]);

  const settingToggle = useCallback(() => {
    if (editSettingModal) {
      setEditColumnModal(false);
      setEditRelationModal(false);
      setEditSettingModal(false);
      setTable(undefined);
    } else {
      setEditSettingModal(true);
    }
  }, [editSettingModal]);

  const handleTableClick = useCallback(
    (arg: Datatable, type: DataType) => {
      setTable({ ...arg });
      setModalType(type);
      tableToggle();
    },
    [tableToggle]
  );

  const handleEditColumnsClick = useCallback(
    (arg?: Datatable) => {
      if (arg) setTable({ ...arg });
      setEditColumnModal(true);
      columnToggle();
    },
    [columnToggle]
  );

  const handleRelationClick = useCallback(
    (arg?: Datatable) => {
      if (arg) setTable({ ...arg });
      setEditRelationModal(true);
      relationToggle();
    },
    [relationToggle]
  );

  const handleSettingClick = useCallback(
    (arg?: Datatable) => {
      if (arg) setTable({ ...arg });
      setEditSettingModal(true);
      settingToggle();
    },
    [settingToggle]
  );
  const handleRowsClick =
    (arg?: Datatable) => {
      if (arg) setTable({ ...arg });
    }

  return {
    table, setTable,
    modalType, setModalType,
    modal, setModal,
    editColumnModal, setEditColumnModal,
    editRelationModal, setEditRelationModal,
    editSettingModal, setEditSettingModal,
    tableToggle, columnToggle, relationToggle, settingToggle,
    handleTableClick, handleEditColumnsClick,
    handleRelationClick, handleSettingClick, handleRowsClick
  };
};