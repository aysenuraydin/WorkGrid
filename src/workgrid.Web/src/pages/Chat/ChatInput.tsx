import React, { useRef, useState } from "react";
import { Row, Button, Spinner } from "reactstrap";
import Picker from "emoji-picker-react";
import useThemeMode from "hooks/useThemeMode";

export interface PendingAttachment {
  file: File;
  type: "image" | "file";   
  previewUrl?: string;   
}

interface Props {
  curMessage: string;
  setCurMessage: (v: string) => void;
  emojiPicker: boolean;
  setEmojiPicker: (v: boolean) => void;
  onSend: (attachment?: PendingAttachment) => Promise<void> | void;
  canSend: boolean;
  isSending?: boolean;
}

const ChatInput: React.FC<Props> = ({
  curMessage, setCurMessage,
  emojiPicker, setEmojiPicker,
  onSend, canSend, isSending,
}) => {
  const { isDark } = useThemeMode(); 
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingAttachment | null>(null);

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    setPending({
      file,
      type: isImage ? "image" : "file",
      previewUrl: isImage ? URL.createObjectURL(file) : undefined,
    });
    e.target.value = ""; // aynı dosyayı tekrar seçebilmek için
  };

  const clearPending = () => {
    if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl);
    setPending(null);
  };

  const handleSend = async () => {
    // metin de yok dosya da yoksa gönderme
    if (!curMessage.trim() && !pending) return;
    await onSend(pending ?? undefined);
    clearPending();
    setEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSend(); }
  };

  if (!canSend) {
    return (
      <div className="chat-input-section p-3 p-lg-4 bg-transparent text-center text-muted">
        <i className="ri-lock-line me-1"></i>
        Bu kanala sadece adminler mesaj gönderebilir.
      </div>
    );
  }

  return (
    <div className="chat-input-section p-3 p-lg-4 bg-transparent">
      {emojiPicker && (
        <div className="alert pickerEmoji">
          <Picker onEmojiClick={e => setCurMessage(curMessage + e.emoji)} />
        </div>
      )}

      {/* ── Seçili dosya önizlemesi ── */}
      {pending && (
        <div className="d-flex align-items-center gap-2 mb-2 p-2 border rounded bg-light">
          {pending.type === "image" ? (
            <img src={pending.previewUrl} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
          ) : (
            <div className="avatar-xs">
              <div className="avatar-title bg-primary-subtle text-primary rounded fs-18">
                <i className="ri-file-text-line" />
              </div>
            </div>
          )}
          <div className="overflow-hidden w-100">
            <p className="mb-0 text-truncate fs-13 ">{pending.file.name}</p>
            <small className="text-muted">{(pending.file.size / 1024).toFixed(0)} KB</small>
          </div>
          <button className="btn btn-sm btn-ghost-danger" onClick={clearPending} disabled={isSending}>
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      <Row className="g-0 align-items-center">
        <div className="col-auto">
          <div className="chat-input-links me-2 d-flex">
            {/* Emoji */}
            <button type="button" className="btn btn-link emoji-btn" onClick={() => setEmojiPicker(!emojiPicker)}>
              <i className="bx bx-smile align-middle"></i>
            </button>
            {/* Dosya ekle */}
            <button type="button" className="btn btn-link" onClick={() => fileRef.current?.click()} title="Dosya ekle">
              <i className="ri-attachment-2 align-middle"></i>
            </button>
            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={pickFile}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
            />
          </div>
        </div>
        <div className="col">
          <input
            type="text"
            value={curMessage}
            onKeyDown={handleKeyDown}
            onChange={e => setCurMessage(e.target.value)}
            className={`form-control chat-input ${isDark?"bg-dark border-light-subtle":"bg-light border-light"}`}
            placeholder={pending ? "Bir not ekleyin (opsiyonel)..." : "Mesajınızı buraya yazınız..."}
            disabled={isSending}
          />
        </div>
        <div className="col-auto">
          <Button
            type="button"
            color="success"
            onClick={handleSend}
            disabled={isSending || (!curMessage.trim() && !pending)}
            className="chat-send waves-effect waves-light ms-2"
          >
            {isSending
              ? <Spinner size="sm" />
              : <i className="ri-send-plane-2-fill align-bottom"></i>}
          </Button>
        </div>
      </Row>
    </div>
  ); 
};

export default ChatInput;