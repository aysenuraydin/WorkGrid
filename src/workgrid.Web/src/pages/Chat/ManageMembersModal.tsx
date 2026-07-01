import { getAvatarUrl } from "common/utils/getAvatarUrl";
import { getUserInitials } from "common/utils/getUserInitials";
import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  activeGroup: any;
  allUsers: any[];
  selectedGroupId: string;
  onAddMember: (args: { groupId: string; userId: string }) => void;
  onRemoveMember: (args: { groupId: string; userId: string }) => void;
}

const ManageMembersModal: React.FC<Props> = ({
  isOpen, toggle,
  activeGroup, allUsers, selectedGroupId,
  onAddMember, onRemoveMember,
}) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>
      Üyeleri Yönet — {activeGroup?.name}
    </ModalHeader>
    <ModalBody>
      <h6 className="text-muted mb-3">Mevcut Üyeler</h6>
      {activeGroup?.members?.map((m: any) => (
        <div key={m.userId} className="d-flex align-items-center mb-2">
          <div className="avatar-xxs me-2">
            {m.avatar ? (
              <img
                src={getAvatarUrl(m.avatar)}
                className="rounded-circle img-fluid"
                alt=""
              />
            ) : (
              <div className="avatar-title border rounded-circle bg-primary fs-10">
                {getUserInitials(m.name?.split(" ")[0], m.name?.split(" ")[1])}
              </div>
            )}
          </div>
          <span className="flex-grow-1">
            {m.name}{" "}
            {m.isAdmin && <span className="badge bg-success ms-1">Yönetici</span>}
          </span>
          {!m.isAdmin && (
            <button
              className="btn btn-sm btn-ghost-danger"
              onClick={() => onRemoveMember({ groupId: selectedGroupId, userId: m.userId })}
              title="Üyeyi Çıkar"
            >
              <i className="ri-user-unfollow-line"></i>
            </button>
          )}
        </div>
      ))}

      <hr />

      <h6 className="text-muted mb-3">Üye Ekle</h6>
      {allUsers
        .filter((u: any) => !activeGroup?.members?.find((m: any) => m.userId === u.id))
        .map((u: any) => (
          <div key={u.id} className="d-flex align-items-center mb-2">
            <span className="flex-grow-1">
              {`${u.firstName} ${u.lastName}`.trim() || u.username}
            </span>
            <button
              className="btn btn-sm btn-soft-success"
              onClick={() => onAddMember({ groupId: selectedGroupId, userId: u.id })}
              title="Üyeyi Ekle"
            >
              <i className="ri-user-add-line"></i>
            </button>
          </div>
        ))}
    </ModalBody>
    <ModalFooter>
      <button className="btn btn-secondary" onClick={toggle}>Kapat</button>
    </ModalFooter>
  </Modal>
);

export default ManageMembersModal;
