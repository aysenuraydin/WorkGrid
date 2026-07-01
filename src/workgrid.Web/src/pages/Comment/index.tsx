import React, { useEffect } from "react";
import SimpleBar from "simplebar-react";
import { useAuth } from "context/AuthContext";
import { CommentProvider, useCommentContext } from "context/Commentcontext";
import { RatingSummary } from "./Components/Ratingsummary";
import { CommentItemType } from "common/data/comment";
import { CommentItem } from "./Components/Commentitem";
import { CommentForm } from "./Components/Commentform";

const CommentListInner = ({itemType}:{itemType:CommentItemType}) => {
  const { tree, flat, isLoading, currentUserId } = useCommentContext();

  const { user } = useAuth();
  const isLoggedIn = !!currentUserId || !!user?.id;

  return (
    <div>
      <h5 className="fw-semibold mb-3">
        Yorumlar <span className="text-muted fs-14">({flat?.length})</span>
      </h5>

      <RatingSummary />
      {isLoading ? (
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm text-primary" />
        </div>
      ) : tree.length === 0 ? (
        <div className="text-center py-4 text-muted">
          <i className="ri-chat-3-line fs-24 d-block mb-2 opacity-50" />
          <p className="mb-0">Henüz yorum yok. İlk yorumu sen yap.</p>
        </div>
      ) : (
        <SimpleBar style={{ maxHeight: 400 }} className="px-3 mx-n3 mb-2">
          {tree.map(c => <CommentItem key={c.id} comment={c}  itemType={itemType} />)}
        </SimpleBar>
      )}

      {isLoggedIn ? (
        <CommentForm />
      ) : (
        <div className="alert alert-light border text-center mt-3 mb-0">
          Yorum yapmak için <a href="/login">giriş yapın</a>.
        </div>
      )}
    </div>
  );
};

interface CommentListProps {
  itemType: CommentItemType;
  itemId: string | number;
  isRating?: boolean; 
}

export const CommentList: React.FC<CommentListProps> = ({ itemType, itemId, isRating = false }) => (
  <CommentProvider itemType={itemType} itemId={itemId} isRating={isRating} >
    <CommentListInner itemType={itemType}/>
  </CommentProvider>
);