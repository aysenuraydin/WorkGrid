import React, { useState } from "react";
import moment from "moment";
import { Image } from "antd";
import config from "config";
import { toast } from "react-toastify";

import { useCommentContext } from "context/Commentcontext";
import { Comment, CommentItemType } from "common/data/comment";
import { CommentForm } from "./Commentform";
import userDummayImage from "assets/images/users/user-dummy-img.jpg"; 
import { getInitials } from "common/utils/getInitials";
import { useAuth } from "context/AuthContext";
import { PopConfirm } from "components/Common/PopConfirm";
import { ModalType } from "common/enums/ModalType";
import useThemeMode from "hooks/useThemeMode";

const resolveImg = (name: string) =>
    name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

const Stars = ({ value }: { value: number }) => (
    <span className="text-warning fs-13">
        {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={i <= value ? "mdi mdi-star" : "mdi mdi-star-outline"} />
        ))}
    </span>
);

const RatingPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="d-inline-flex gap-1 fs-5">
        {[1, 2, 3, 4, 5].map(i => (
        <i
            key={i}
            role="button"
            className={i <= value ? "mdi mdi-star text-warning" : "mdi mdi-star-outline text-muted"}
            onClick={() => onChange(i)}
        />
        ))}
    </div>
);

export const CommentItem = ({ comment, itemType, isReply}:{ comment: Comment, itemType?:CommentItemType, isReply?:boolean}) => {
    const { isRating, currentUserId, isAdmin, update, remove } = useCommentContext();
    const [replyOpen, setReplyOpen] = useState(false);
    const { user } = useAuth(); 
    const { isDark } = useThemeMode();

    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [editRating, setEditRating] = useState(comment.rating ?? 0);

    const canDelete = currentUserId === comment.userId || isAdmin || (itemType == CommentItemType.User && comment.itemId ==  user?.id);
    const canUpdate = currentUserId === comment.userId; 
    const when = comment.createdAt ? moment.utc(comment.createdAt).local().fromNow() : "";

    const handleDelete = (commentId:number) => {
        remove.mutate(commentId, {
        onSuccess: () => toast.success("Yorum silindi."),
        onError: () => toast.error("Yorum silinemedi."),
        });
    };

    const startEdit = () => {
        setEditContent(comment.content);
        setEditRating(comment.rating ?? 0);
        setEditing(true);
    };

    const handleUpdate = (commentId:number) => {
        const text = editContent.trim();
        if (!text) { toast.error("Yorum boş olamaz."); return; }
        if (isRating && editRating < 1) { toast.error("Puan verin."); return; }

        update.mutate(
        {
            commentId: commentId,
            payload: {
                id: commentId,
                content: text,
                rating: isRating ? editRating : null,
            },
        },
        {
            onSuccess: () => { toast.success("Yorum güncellendi."); setEditing(false); },
            onError: () => toast.error("Yorum güncellenemedi."),
        }
        );
    };

    return (
        <div className="d-flex mb-4">
        <div className="flex-shrink-0"> 
            {!comment.authorAvatarUrl ? (
                <div className="avatar-title border bg-soft-primary rounded-circle text-uppercase" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getInitials(comment.authorName ?? "")}
                </div>
            ) : (
                <div> 
                    <img className="rounded-circle header-profile-user border" 
                        src={`${config.api.FILE_API_URL}/File/${comment.authorAvatarUrl}`}
                        alt="Header Avatar" 
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = userDummayImage; }}
                    /> 
                </div>
            )} 
        </div>
        <div className="flex-grow-1 ms-3">
            <div className="d-flex justify-content-between align-items-start">
            <h5 className="fs-13 mb-1">
                {comment.authorName ?? "Kullanıcı"}
                <small className="text-muted ms-2">{when}</small>
                {isRating && comment.parentId == null && comment.rating != null && !editing && (
                <span className="ms-2"><Stars value={comment.rating} /></span>
                )}
            </h5>
            {!editing && (
                <div className="d-flex gap-1">
                {canUpdate && (
                    <button
                    className="btn btn-sm btn-ghost-secondary p-0 px-1"
                    onClick={startEdit}
                    title="Düzenle"
                    >
                    <i className="ri-pencil-line" />
                    </button>
                )}
                {canDelete && (
                    <>
                        <button id={`comment-pop-${comment.id}`}
                        className="btn btn-sm btn-ghost-danger p-0 px-1" 
                        title="Sil"
                        >
                        <i className="ri-delete-bin-line" />
                        </button>
                        <PopConfirm
                            targetId={`comment-pop-${comment.id}`}
                            type={ModalType.Alert}
                            message="Bu yorumu silmek istediğinize emin misiniz?"
                            confirmText="Sil!"
                            onConfirm={async () => handleDelete(comment.id)}
                            onClose={() => toast.error("Silinemedi!")}
                        />
                    </>
                )}
                </div>
            )}
            </div>

            {editing ? (
            <div className="mb-2">
                {isRating && (
                <div className="mb-2">
                    <RatingPicker value={editRating} onChange={setEditRating} />
                </div>
                )}
                <textarea
                className="form-control bg-light border-light"
                rows={3}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                />
                <div className="d-flex justify-content-end gap-2 mt-2">
                <button className="btn btn-light btn-sm" onClick={() => setEditing(false)}>
                    İptal
                </button>
                <button
                    className="btn btn-success btn-sm"
                    onClick={()=>handleUpdate(comment.id)}
                    disabled={update.isPending}
                >
                    {update.isPending ? "Kaydediliyor…" : "Kaydet"}
                </button>
                </div>
            </div>
            ) : (
            <p className="text-muted mb-2">{comment.content}</p>
            )}

            {!editing && comment.images?.length > 0 && (
            <div className="d-flex gap-2 flex-wrap mb-2">
                <Image.PreviewGroup>
                {comment.images.map((img, i) => (
                    <Image
                    key={i}
                    src={resolveImg(img)}
                    alt=""
                    width={64}
                    height={64}
                    style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                ))}
                </Image.PreviewGroup>
            </div>
            )}

            {/* Reply butonu */}
            {!editing && comment.parentId == null && (
            <button
                className={`badge text-muted bg-${isDark ?"soft-":""}light border-0`}
                onClick={() => setReplyOpen(o => !o)}
            >
                <i className={`mdi mdi-reply ${isDark ?"text-light":""}`}/> Yanıtla
            </button>
            )}

            {replyOpen && (
            <CommentForm parentId={comment.id} onDone={() => setReplyOpen(false)} />
            )}

            {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
                {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply}  isReply={true}/>
                ))}
            </div>
            )}
        </div>
        </div>
    );
};