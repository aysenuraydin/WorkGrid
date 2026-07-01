import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import classnames from "classnames";
import { ChatMode } from "./useChatUI";
import { getUserInitials } from "common/utils/getUserInitials";
import { getAvatarUrl } from "common/utils/getAvatarUrl";

interface Props {
  customActiveTab: string;
  setCustomActiveTab: (tab: string) => void;

  contacts: any[];
  channels: any[];
  myGroups: any[];
  allUsers: any[];
  onlineSet: Set<string>;
  isAdmin: boolean;
  currentUserId: string;

  chatMode: ChatMode;
  selectedUserId: string | null;
  selectedChannelId: string | null;
  selectedGroupId: string | null;

  onUserClick: (id: string, name: string, avatar?: string) => void;
  onChannelClick: (id: string, name: string) => void;
  onGroupClick: (id: string, name: string) => void;
  onDeleteChannel: (id: string) => void;
  onCreateGroupOpen: () => void;
  onCreateChannelOpen: () => void;
}

const ChatSidebar: React.FC<Props> = ({
  customActiveTab, setCustomActiveTab,
  contacts, channels, myGroups, allUsers, onlineSet, isAdmin, currentUserId,
  chatMode, selectedUserId, selectedChannelId, selectedGroupId,
  onUserClick, onChannelClick, onGroupClick, onDeleteChannel,
  onCreateGroupOpen, onCreateChannelOpen,
}) => {
  const groupedContacts = useMemo(() => {
    const sorted = [...allUsers]
      .filter((u: any) => u.id !== currentUserId)
      .sort((a: any, b: any) => (a.firstName || "").localeCompare(b.firstName || ""));

    const groups: Record<string, any[]> = {};
    sorted.forEach((u: any) => {
      const letter = (u.firstName?.charAt(0) || u.username?.charAt(0) || "#").toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(u);
    });

    return Object.entries(groups).map(([title, contacts]) => ({ title, contacts }));
  }, [allUsers, currentUserId]);

  return (
    <div className="chat-leftsidebar border bg-transparent">
      <div className="px-4 pt-4 mb-3">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1"><h5 className="mb-4">Sohbetler</h5></div>
        </div>
        <div className="search-box">
          <input
            type="text"
            className="form-control bg-light border-light"
            placeholder="Arama yap..."
          />
          <i className="ri-search-2-line search-icon"></i>
        </div>
      </div>

      <Nav tabs className="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-3">
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            className={classnames({ active: customActiveTab === "1", "text-primary": customActiveTab === "1" })}
            onClick={() => setCustomActiveTab("1")}
          >
            Sohbetler
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            className={classnames({ active: customActiveTab === "2",  "text-primary": customActiveTab === "2" })}
            onClick={() => setCustomActiveTab("2")}
          >
            Kişiler
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={customActiveTab} className="text-muted">
        {/* ── Sohbetler Sekmesi ── */}
        <TabPane tabId="1" id="chats">
          <SimpleBar className="chat-room-list pt-3" style={{ margin: "-16px 0px 0px" }}>

            {/* Özel Mesajlar */}
            <div className="d-flex align-items-center px-4 mb-2">
              <div className="flex-grow-1">
                <h4 className="mb-0 fs-11 text-muted text-uppercase">Özel Mesajlar</h4>
              </div>
            </div>
            <div className="chat-message-list">
              <ul className="list-unstyled chat-list chat-user-list users-list" id="userList">
                {contacts.map((contact: any) => (
                  <li
                    key={contact.id}
                    className={selectedUserId === contact.id && chatMode === "direct" ? "active" : ""}
                  >
                    <Link to="#" onClick={() => onUserClick(contact.id, contact.name, contact.profilePictureUrl)}>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 chat-user-img align-self-center me-2 ms-0">
                          <div className="avatar-xxs">
                            {!contact.profilePictureUrl ? (
                              <div className="rounded-circle img-fluid userprofile border" style={{ aspectRatio: "1/1" }}>
                                {getUserInitials(contact.name?.split(" ")[0], contact.name?.split(" ")[1])}
                              </div>
                            ) : (
                              <img
                                className="rounded-circle img-fluid userprofile"
                                alt=""
                                src={getAvatarUrl(contact.profilePictureUrl)}
                                style={{ aspectRatio: "1/1" }}
                              />
                            )}
                          </div>
                          <span className={`user-status ${onlineSet.has(contact.id) ? "bg-success" : "bg-secondary"}`}></span>
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-truncate mb-0">{contact.name}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gruplar */}
            <div className="d-flex align-items-center px-4 mt-4 pt-2 mb-2">
              <div className="flex-grow-1">
                <h4 className="mb-0 fs-11 text-muted text-uppercase">Gruplar</h4>
              </div>
              <div className="flex-shrink-0">
                <UncontrolledTooltip placement="bottom" target="createGroup">Grup Oluştur</UncontrolledTooltip>
                <button
                  type="button"
                  id="createGroup"
                  className="btn btn-soft-success btn-sm"
                  onClick={onCreateGroupOpen}
                >
                  <i className="ri-add-line align-bottom"></i>
                </button>
              </div>
            </div>
            <div className="chat-message-list">
              <ul className="list-unstyled chat-list chat-user-list mb-0 users-list">
                {myGroups.map((g: any) => (
                  <li
                    key={g.id}
                    className={selectedGroupId === g.id && chatMode === "group" ? "active" : ""}
                  >
                    <Link to="#" onClick={() => onGroupClick(g.id, g.name)}>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 chat-user-img online align-self-center me-2 ms-0">
                          <div className="avatar-xxs">
                            <div className="avatar-title bg-success-subtle rounded-circle text-success">
                              <i className="ri-group-line"></i>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-truncate mb-0">{g.name}</p>
                          <small className="text-muted">{g.members?.length} üye</small>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kanallar */}
            <div className="d-flex align-items-center px-4 mt-4 pt-2 mb-2">
              <div className="flex-grow-1">
                <h4 className="mb-0 fs-11 text-muted text-uppercase">Kanallar</h4>
              </div>
              {isAdmin && (
                <div className="flex-shrink-0">
                  <UncontrolledTooltip placement="bottom" target="createChannel">Kanal Oluştur</UncontrolledTooltip>
                  <button
                    type="button"
                    id="createChannel"
                    className="btn btn-soft-success btn-sm"
                    onClick={onCreateChannelOpen}
                  >
                    <i className="ri-add-line align-bottom"></i>
                  </button>
                </div>
              )}
            </div>
            <div className="chat-message-list">
              <ul className="list-unstyled chat-list chat-user-list mb-0 users-list">
                {channels.map((ch: any) => (
                  <li
                    key={ch.id}
                    className={selectedChannelId === ch.id && chatMode === "channel" ? "active" : ""}
                  >
                    <Link to="#" onClick={() => onChannelClick(ch.id, ch.name)}>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 chat-user-img online align-self-center me-2 ms-0">
                          <div className="avatar-xxs">
                            <div className="avatar-title bg-light rounded-circle text-body">#</div>
                          </div>
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-truncate mb-0">{ch.name}</p>
                        </div>
                        {isAdmin && (
                          <button
                            className="btn btn-sm btn-ghost-danger ms-1"
                            onClick={e => { e.preventDefault(); e.stopPropagation(); onDeleteChannel(ch.id); }}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </SimpleBar>
        </TabPane>

        {/* ── Kişiler Sekmesi ── */}
        <TabPane tabId="2" id="contacts">
          <SimpleBar className="chat-room-list pt-3" style={{ margin: "-16px 0px 0px" }}>
            <div className="sort-contact">
              {groupedContacts.map((group, key) => (
                <div className="mt-3" key={key}>
                  <div className="contact-list-title">{group.title}</div>
                  <ul id={`contact-sort-${group.title}`} className="list-unstyled contact-list">
                    {group.contacts.map((u: any, k: number) => (
                      <li key={k}>
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-2 position-relative">
                            <div className="avatar-xxs">
                              {!u.profilePictureUrl ? (
                                <div className="rounded-circle img-fluid userprofile border" style={{ aspectRatio: "1/1" }}>
                                  {getUserInitials(u.firstName, u.lastName)}
                                </div>
                              ) : (
                                <img
                                  className="rounded-circle img-fluid userprofile"
                                  alt=""
                                  src={getAvatarUrl(u.profilePictureUrl)}
                                  style={{ aspectRatio: "1/1" }}
                                />
                              )}
                            </div>
                            <span
                              className="position-absolute bottom-0 end-0 rounded-circle border border-white"
                              style={{
                                width: 8, height: 8,
                                backgroundColor: onlineSet.has(u.id) ? "#0ab39c" : "#878a99",
                              }}
                            />
                          </div>
                          <div
                            className="flex-grow-1"
                            onClick={() => onUserClick(u.id, u.name, u.profilePictureUrl)}
                          >
                            <p className="text-truncate contactlist-name mb-0">
                              {`${u.firstName} ${u.lastName}`.trim() || u.username}
                            </p>
                            <small className={onlineSet.has(u.id) ? "text-success" : "text-muted"}>
                              {onlineSet.has(u.id) ? "Çevrimiçi" : "Çevrimdışı"}
                            </small>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SimpleBar>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default ChatSidebar;
