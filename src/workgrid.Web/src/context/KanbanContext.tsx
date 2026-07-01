import { KanbanCardDto } from "common/data/kanban";
import { KanbanStatus } from "common/enums/KanbanStatus";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface KanbanContextValue {
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;

  cardModal: boolean;
  isEditCard: boolean;
  activeCard: KanbanCardDto | null;
  activeStatus: KanbanStatus | null;   
  openAddCard: (status: KanbanStatus) => void;
  openEditCard: (card: KanbanCardDto) => void;
  closeCardModal: () => void;

  // Delete modal
  deleteModal: boolean;
  pendingDeleteId: string | null;
  openDeleteModal: (cardId: string, isBack?:boolean) => void;
  closeDeleteModal: () => void; 

  boardModal: boolean;
  openBoardModal: () => void;
  closeBoardModal: () => void;

  searchText: string;
  setSearchText: (text: string) => void;
}

const KanbanContext = createContext<KanbanContextValue | null>(null);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [cardModal, setCardModal]       = useState(false);
  const [isEditCard, setIsEditCard]     = useState(false);
  const [activeCard, setActiveCard]     = useState<KanbanCardDto | null>(null);
  const [activeStatus, setActiveStatus] = useState<KanbanStatus | null>(null);

  const [deleteModal, setDeleteModal]       = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [boardModal, setBoardModal] = useState(false);

  const openBoardModal  = () => setBoardModal(true);
  const closeBoardModal = () => setBoardModal(false);

  const openAddCard = (status: KanbanStatus) => {
    setActiveCard(null);
    setActiveStatus(status);
    setIsEditCard(false);
    setCardModal(true);
  };

  const openEditCard = (card: KanbanCardDto) => {
    setActiveCard(card);
    setActiveStatus(card.status);
    setIsEditCard(true);
    setCardModal(true);
  };

  const closeCardModal = () => {
    setCardModal(false);
    setActiveCard(null);
    setActiveStatus(null);
  };

  const openDeleteModal = (cardId: string, isBack?:boolean) => {
    setPendingDeleteId(cardId);
    setDeleteModal(true);
    setTimeout(() => {
      if(isBack)  navigate(-1);
    }, 2000);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setPendingDeleteId(null);
  };

  return (
    <KanbanContext.Provider value={{
      searchText, setSearchText,
      activeProjectId, setActiveProjectId,
      cardModal, isEditCard, activeCard, activeStatus,
      openAddCard, openEditCard, closeCardModal,
      deleteModal, pendingDeleteId, openDeleteModal, closeDeleteModal,
      closeBoardModal, openBoardModal, boardModal
    }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanbanContext = () => {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error("useKanbanContext must be used inside <KanbanProvider>");
  return ctx;
};
