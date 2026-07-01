import React, { useRef, useEffect } from "react";
import SimpleBar from "simplebar-react";
import { Image } from "antd";
import { ChatMode } from "./useChatUI";
import { getAvatarUrl } from "common/utils/getAvatarUrl";
import config from "config";
import useThemeMode from "hooks/useThemeMode";

interface Props {
  messages: any[];
  currentUserId: string;
  chatMode: ChatMode;
  readReceipts: any;
}

const fileUrl = (name: string) =>
  name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

const ChatMessages: React.FC<Props> = ({ messages, currentUserId, chatMode, readReceipts }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const { isDark } = useThemeMode(); 
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="position-relative" id="users-chat">
      <SimpleBar className="chat-conversation p-3 p-lg-4" id="chat-conversation">
        <ul className="list-unstyled chat-conversation-list" id="users-conversation">
          {messages.map((msg: any, idx: number) => {
            const isOwn = msg.senderId === currentUserId;
            const isRead = msg.isRead || !!readReceipts[msg.id];
            const hasAttachment = !!msg.attachmentUrl;
            const isImage = msg.attachmentType === "image";

            return (
              <li key={msg.id ?? idx} className={isOwn ? "chat-list right" : "chat-list left"}>
                <div className="conversation-list">
                  {!isOwn && (
                    <div className="chat-avatar">
                      <img src={getAvatarUrl(msg.senderAvatar)} alt="" />
                    </div>
                  )}
                  <div className="user-chat-content">
                    <div className="ctext-wrap">
                      <div className="ctext-wrap-content">
                        {!isOwn && (
                          <div className="conversation-name fw-medium text-primary mb-1 ">
                            {msg.senderName}
                          </div>
                        )}

                        {/* ── Attachment ── */}
                        {hasAttachment && (
                          isImage ? (
                            // Foto inline (tıklayınca büyür)
                            <div className="mb-1">
                              <Image
                                src={fileUrl(msg.attachmentUrl)}
                                alt={msg.attachmentName || ""}
                                style={{ maxWidth: 220, maxHeight: 220, borderRadius: 6, objectFit: "cover" }}
                              />
                            </div>
                          ) : (
                            // Dosya indirme linki
                            <a
                              href={fileUrl(msg.attachmentUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={msg.attachmentName}
                              className="d-flex align-items-center gap-2 p-2 mb-1 rounded text-decoration-none border"
                              style={{ background: "rgba(0,0,0,.03)", maxWidth: 240 }}
                            >
                              <div className="avatar-xs flex-shrink-0">
                                <div className="avatar-title bg-primary-subtle text-primary rounded fs-18">
                                  <i className="ri-file-text-line" />
                                </div>
                              </div>
                              <div className="overflow-hidden flex-grow-1">
                                <p className="mb-0 text-truncate fs-13 text-body">
                                  {msg.attachmentName || "Dosya"}
                                </p>
                                <small className="text-muted">
                                  <i className="ri-download-2-line me-1" />İndir
                                </small>
                              </div>
                            </a>
                          )
                        )}

                        {/* Metin (varsa) */}
                        {msg.messageText && (
                          <p className={`mb-0 ctext-content`}>
                            <span className={`${isDark?"text-primary":""}`}>{msg.messageText}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="conversation-name d-flex align-items-center gap-1">
                      <small className="text-muted time">
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </small>
                      {isOwn && chatMode === "direct" && (
                        <span title={isRead ? "Görüldü" : "İletildi"}>
                          <i className={`ri-check-double-line fs-14 ${isRead ? "text-primary" : "text-muted"}`} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <div ref={endRef} />
        </ul>
      </SimpleBar>
    </div>
  );
};

export default ChatMessages;