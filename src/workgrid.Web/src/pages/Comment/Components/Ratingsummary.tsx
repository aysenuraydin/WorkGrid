import { useCommentContext } from "context/Commentcontext";
import { getRatingSummary } from "helpers/comment.helper";
import React from "react"; 

const Stars = ({ value }: { value: number }) => (
  <span className="text-warning">
    {[1, 2, 3, 4, 5].map(i => (
      <i key={i} className={i <= Math.round(value) ? "mdi mdi-star" : "mdi mdi-star-outline"} />
    ))}
  </span>
);

export const RatingSummary: React.FC = () => {
  const { flat, isRating } = useCommentContext();
  if (!isRating) return null;

  const { average, total, distribution } = getRatingSummary(flat);

  return (
    <div className="border border-2 rounded p-3 mb-4 col-6">
      <div className="row align-items-center">
        <div className="col-md-4 text-center border-end">
          <h2 className="mb-1 fw-bold">{average.toFixed(1)}</h2>
          <Stars value={average} />
          <p className="text-muted mb-0 mt-1 fs-13">{total} değerlendirme</p>
        </div>

        <div className="col-md-8">
          {[5, 4, 3, 2, 1].map(star => {
            const count = distribution[star] ?? 0;
            const pct = total === 0 ? 0 : Math.round((count / total) * 100);
            return (
              <div key={star} className="d-flex align-items-center gap-2 mb-1">
                <span className="text-muted fs-13" style={{ width: 28 }}>{star} <i className="mdi mdi-star text-warning" /></span>
                <div className="progress flex-grow-1" style={{ height: 6 }}>
                  <div className="progress-bar bg-warning" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-muted fs-13" style={{ width: 32 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};