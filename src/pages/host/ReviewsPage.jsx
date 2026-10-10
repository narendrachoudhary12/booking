// pages/host/ReviewsPage.jsx
// Guest reviews of the selected hotel. The owner can answer each one.

import { useState } from "react";
import popup from "../../components/common/Popup/popupService";
import useLoad from "../../hooks/useLoad";
import { apiError, getHostReviews, replyHostReview } from "../../services/hostApi";
import Loadable from "./Loadable";
import { shortDate } from "./hostFormat";

function Review({ review, onReply }) {
  const [editing, setEditing] = useState(false);
  const [reply, setReply] = useState(review.owner_reply || "");
  const [saving, setSaving] = useState(false);

  const save = async (text) => {
    setSaving(true);
    if (await onReply(review.id, text)) setEditing(false);
    setSaving(false);
  };

  return (
    <div className="hd-notif-item" style={{ display: "block" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div className="hd-guest-name">
          {review.guest_name}
          <span style={{ marginLeft: 8, color: "var(--hd-gold)" }}>
            {"★".repeat(review.rating)}
            <span style={{ color: "var(--hd-border)" }}>{"★".repeat(Math.max(0, 5 - review.rating))}</span>
          </span>
        </div>
        <div className="hd-notif-time">{shortDate(review.created_at)}</div>
      </div>

      {review.title && <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 6 }}>{review.title}</div>}
      {review.comment && <div className="hd-notif-text" style={{ marginTop: 4 }}>{review.comment}</div>}

      {review.owner_reply && !editing && (
        <div className="hd-modal-notice" style={{ marginTop: 10, fontSize: 13 }}>
          <strong>Your reply:</strong> {review.owner_reply}
        </div>
      )}

      {editing ? (
        <div className="hd-form-group" style={{ marginTop: 10 }}>
          <textarea rows={3} maxLength={1000} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a public reply..." />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="hd-btn hd-btn-primary hd-btn-sm" disabled={saving || !reply.trim()} onClick={() => save(reply.trim())}>
              {saving ? "Saving..." : "Save reply"}
            </button>
            <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => setEditing(true)}>
            {review.owner_reply ? "Edit reply" : "Reply"}
          </button>
          {review.owner_reply && (
            <button className="hd-btn hd-btn-outline hd-btn-sm" disabled={saving} onClick={() => save("")}>
              Remove reply
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewsPage({ hotel }) {
  const { data, error, reload } = useLoad(() => getHostReviews(hotel.id), [hotel.id], apiError);

  // Resolves true when the reply was saved
  const handleReply = async (reviewId, reply) => {
    try {
      const res = await replyHostReview(hotel.id, reviewId, reply);
      await reload();
      popup.success(res.message);
      return true;
    } catch (err) {
      popup.error(apiError(err));
      return false;
    }
  };

  return (
    <Loadable data={data} error={error}>
      {data && (
        <div className="hd-card" style={{ maxWidth: 860 }}>
          <div className="hd-card-header">
            <div className="hd-card-title">
              Guest reviews
              {data.summary.count > 0 && ` — ${data.summary.average} ★ from ${data.summary.count}`}
            </div>
          </div>
          <div className="hd-card-body">
            {data.reviews.length === 0 && (
              <div style={{ color: "var(--hd-muted)", fontSize: 14 }}>
                No reviews yet. Guests can review your hotel after their stay.
              </div>
            )}
            {data.reviews.map((review) => (
              <Review key={review.id} review={review} onReply={handleReply} />
            ))}
          </div>
        </div>
      )}
    </Loadable>
  );
}
