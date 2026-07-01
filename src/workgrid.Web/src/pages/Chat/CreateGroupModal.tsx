import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  allUsers: any[];
  currentUserId: string;
  newGroupName: string;
  setNewGroupName: (v: string) => void;
  newGroupMembers: string[];
  setNewGroupMembers: (v: string[]) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

const CreateGroupModal: React.FC<Props> = ({
  isOpen, toggle,
  allUsers, currentUserId,
  newGroupName, setNewGroupName,
  newGroupMembers, setNewGroupMembers,
  onSubmit, onCancel,
}) => {
  const toggleMember = (id: string, checked: boolean) => {
    setNewGroupMembers(
      checked ? [...newGroupMembers, id] : newGroupMembers.filter(x => x !== id)
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Yeni Grup Oluştur</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <label className="form-label">Grup Adı</label>
          <input
            type="text"
            className="form-control"
            placeholder="Grup ismi girin..."
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Üye Ekle</label>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {allUsers
              .filter((u: any) => u.id !== currentUserId)
              .map((u: any) => (
                <div key={u.id} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`member-${u.id}`}
                    checked={newGroupMembers.includes(u.id)}
                    onChange={e => toggleMember(u.id, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`member-${u.id}`}>
                    {`${u.firstName} ${u.lastName}`.trim() || u.username}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-secondary" onClick={onCancel}>İptal</button>
        <button className="btn btn-primary" onClick={onSubmit}>Oluştur</button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateGroupModal;
