import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap"; 
import { ChatMode } from "./useChatUI";
import { getAvatarUrl } from "common/utils/getAvatarUrl";

interface Props {
  chatMode: ChatMode;
  selectedName: string;
  selectedAvatar?: string;
  selectedUserId: string | null;
  activeGroup: any;
  isGroupAdmin: boolean;
  onlineSet: Set<string>;
  isAdmin: boolean;
  onBack: () => void;

  editingGroupName: boolean;
  tempGroupName: string;
  setTempGroupName: (v: string) => void;
  onStartEditGroupName: () => void;
  onSaveGroupName: () => Promise<void>;
  onCancelEditGroupName: () => void;
  onManageMembers: () => void;
  onDeleteGroup: () => void;
}

const ChatTopbar: React.FC<Props> = ({
  chatMode, selectedName, selectedAvatar, selectedUserId,
  activeGroup, isGroupAdmin, onlineSet, isAdmin,
  onBack,
  editingGroupName, tempGroupName, setTempGroupName,
  onStartEditGroupName, onSaveGroupName, onCancelEditGroupName,
  onManageMembers, onDeleteGroup,
}) => (
  <div className="p-3 user-chat-topbar bg-transparent">
    <Row className="align-items-center">
      <Col sm={4} xs={8}>
        <div className="d-flex align-items-center">
          {/* Mobil geri butonu */}
          <div className="flex-shrink-0 d-block d-lg-none me-3">
            <Link to="#" className="user-chat-remove fs-18 p-1" onClick={onBack}>
              <i className="ri-arrow-left-s-line align-bottom"></i>
            </Link>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0 chat-user-img online user-own-img align-self-center me-3 ms-0">
            {chatMode === "channel" ? (
              <div className="avatar-xs">
                <div className="avatar-title bg-light rounded-circle text-body">#</div>
              </div>
            ) : chatMode === "group" ? (
              <div className="avatar-xs">
                <div className="avatar-title bg-success-subtle rounded-circle text-success border">
                  <i className="ri-group-line"></i>
                </div>
              </div>
            ) : (
              <img
                src={getAvatarUrl(selectedAvatar)}
                className="rounded-circle avatar-xs"
                alt=""
              />
            )}
          </div>

          {/* İsim & Durum */}
          <div className="flex-grow-1 overflow-hidden">
            <h5 className="text-truncate mb-0 fs-16">{selectedName}</h5>
            {chatMode === "direct" && selectedUserId && (
              <p className={`mb-0 fs-12 ${onlineSet.has(selectedUserId) ? "text-success" : "text-muted"}`}>
                <i className="ri-checkbox-blank-circle-fill me-1 align-bottom" style={{ fontSize: 8 }}></i>
                {onlineSet.has(selectedUserId) ? "Çevrimiçi" : "Çevrimdışı"}
              </p>
            )}
            {chatMode === "channel" && !isAdmin && (
              <p className="text-muted fs-12 mb-0">Salt okunur</p>
            )}
            {chatMode === "group" && (
              <p className="text-muted fs-12 mb-0">{activeGroup?.members?.length} üye</p>
            )}
          </div>
        </div>
      </Col>

      {chatMode === "group" && isGroupAdmin && (
        <Col>
          <div className="d-flex align-items-center gap-2 justify-content-end">
            {editingGroupName ? (
              <>
                <input
                  className="form-control form-control-sm"
                  style={{ width: 150 }}
                  value={tempGroupName}
                  onChange={e => setTempGroupName(e.target.value)}
                />
                <button className="btn btn-sm btn-success" onClick={onSaveGroupName} title="Kaydet">
                  <i className="ri-check-line"></i>
                </button>
                <button className="btn btn-sm btn-light" onClick={onCancelEditGroupName} title="İptal">
                  <i className="ri-close-line"></i>
                </button>
              </>
            ) : (
              <button className="btn btn-sm btn-ghost-secondary" onClick={onStartEditGroupName} title="İsmi Düzenle">
                <i className="ri-pencil-line"></i>
              </button>
            )}
            <button className="btn btn-sm btn-ghost-secondary" onClick={onManageMembers} title="Üyeleri Yönet">
              <i className="ri-user-settings-line"></i>
            </button>
            <button className="btn btn-sm btn-ghost-danger" onClick={onDeleteGroup} title="Grubu Sil">
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </Col>
      )}
    </Row>
  </div>
);

export default ChatTopbar;
