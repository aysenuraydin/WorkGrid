import React from "react";
import { Modal, ModalBody, ModalHeader, Badge } from "reactstrap";
import { Image } from "antd";
import moment from "moment";
import { Comment, CommentItemType } from "common/data/comment";
import config from "config";
import { ModalSizeType } from "common/enums/ModalSizeType";
import useThemeMode from "hooks/useThemeMode";

const resolveImg = (name: string) =>
  name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

const Stars = ({ value }: { value: number }) => (
  <span className="text-warning fs-5">
    {[1, 2, 3, 4, 5].map(i => (
      <i key={i} className={i <= value ? "mdi mdi-star" : "mdi mdi-star-outline"} />
    ))}
  </span>
);

interface Props {
  isOpen: boolean;
  toggle: () => void;
  comment: Comment | null;
  isRating: boolean;
  modalSize:ModalSizeType
}

export const CommentDetailModal: React.FC<Props> = ({ isOpen, toggle, comment, isRating, modalSize }) => {
  const { isDark } = useThemeMode(); 
  if (!comment) return null;

  const when = comment.createdAt
    ? moment.utc(comment.createdAt).local().format("DD MMMM YYYY, HH:mm")
    : "";

  return (
    <Modal  size={modalSize?.toLocaleLowerCase() ?? ModalSizeType.Md}
            fullscreen={modalSize === ModalSizeType.Full}
    isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className={`bg-${isDark?'soft-':''}light p-3`}>
        Yorum Detayı <span className="text-muted fs-14">#{comment.id}</span>
      </ModalHeader>
      <ModalBody>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="fs-15 mb-1">{comment.authorName ?? "Kullanıcı"}</h5>
            <small className="text-muted">{when}</small>
          </div>
          <Badge color="soft-primary" className="text-primary">
            Item: {comment.itemId}
            {comment.parentId ? ` (yanıt #${comment.parentId})` : ""}
          </Badge>
        </div>

        {isRating && comment.rating != null && (
          <div className="mb-3">
            <Stars value={comment.rating} />
            <span className="text-muted ms-2 fs-14">{comment.rating}/5</span>
          </div>
        )}



        {comment.images?.length > 0 && (
          <div>
            <h6 className="text-muted mb-2">Fotoğraflar ({comment.images.length})</h6>
            <div className="d-flex gap-2 flex-wrap">
              <Image.PreviewGroup>
                {comment.images.map((img, i) => (
                  <Image
                    key={i}
                    src={resolveImg(img)}
                    alt=""
                    width={90}
                    height={90}
                    style={{ objectFit: "cover", borderRadius: 6 }}
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          </div>
        )}
          {/* İçerik — tamamı */}
        <div className={`border border-dashed bg-${isDark?'soft-':''}light rounded p-3 mb-3`}>
          <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{comment.content}</p>
        </div>
      </ModalBody>
    </Modal>
  );
};