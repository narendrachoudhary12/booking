import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import popup from "../common/Popup/popupService";
import StarRating from "../common/StarRating";
import {
  createReview,
  deleteReview,
  getMyReviews,
  updateReview,
} from "../../services/accountApi";

const MIN_COMMENT = 10; // same minimum as the API

const apiError = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Star + comment form, used both to write a new review and to edit one
function ReviewForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [rating, setRating] = useState(initial?.rating || 0);
  const [title, setTitle] = useState(initial?.title || "");
  const [comment, setComment] = useState(initial?.comment || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      popup.warning("Please choose a star rating.");
      return;
    }

    setSaving(true);
    await onSubmit({ rating, title: title.trim(), comment: comment.trim() });
    setSaving(false);
  };

  return (
    <form className="ua-form ua-review-form" onSubmit={handleSubmit}>
      <div className="ua-field">
        <span>Your rating</span>
        <StarRating value={rating} onChange={setRating} size={26} />
      </div>

      <label className="ua-field">
        <span>Title (optional)</span>
        <input
          className="ua-input"
          maxLength={120}
          placeholder="Sum up your stay"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="ua-field">
        <span>Your review</span>
        <textarea
          className="ua-input"
          rows={4}
          minLength={MIN_COMMENT}
          maxLength={2000}
          required
          placeholder="What did you like? What could be better?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>

      <div className="ua-form-actions">
        <button className="ua-btn" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
        <button type="button" className="ua-btn ua-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// "Stays to review" (paid stays without a review yet) and "Your reviews"
export default function ReviewsTab() {
  const [data, setData] = useState(null); // null = still loading
  const [writingFor, setWritingFor] = useState(null); // booking_ref
  const [editingId, setEditingId] = useState(null);

  const load = () =>
    getMyReviews()
      .then(setData)
      .catch(() => setData({ reviews: [], to_review: [] }));

  useEffect(() => {
    load();
  }, []);

  // Runs an API call; on success closes the open form and reloads the lists
  const save = async (call, successMessage) => {
    try {
      await call();
      setWritingFor(null);
      setEditingId(null);
      await load();
      popup.success(successMessage);
    } catch (error) {
      popup.error(apiError(error));
    }
  };

  const handleDelete = async (review) => {
    if (!(await popup.confirm("Delete this review?"))) return;
    save(() => deleteReview(review.id), "Review deleted");
  };

  if (!data) return null;

  const { reviews, to_review: toReview } = data;

  if (reviews.length === 0 && toReview.length === 0) {
    return (
      <div className="ua-empty">
        <h3>No reviews yet</h3>
        <p>After a stay you can rate the hotel and share your experience here.</p>
        <Link to="/" className="ua-btn">
          Find a hotel
        </Link>
      </div>
    );
  }

  return (
    <>
      {toReview.length > 0 && (
        <section className="ua-panel">
          <h2 className="ua-panel-title">Stays to review</h2>

          <ul className="ua-reviews">
            {toReview.map((stay) => (
              <li key={stay.booking_ref} className="ua-review">
                <div className="ua-review-head">
                  <div>
                    <strong>{stay.hotel_name || "Hotel"}</strong>
                    <span className="ua-hint">
                      {formatDate(stay.check_in)} – {formatDate(stay.check_out)}
                    </span>
                  </div>
                  {writingFor !== stay.booking_ref && (
                    <button
                      type="button"
                      className="ua-btn"
                      onClick={() => {
                        setEditingId(null);
                        setWritingFor(stay.booking_ref);
                      }}
                    >
                      Write a review
                    </button>
                  )}
                </div>

                {writingFor === stay.booking_ref && (
                  <ReviewForm
                    submitLabel="Post review"
                    onCancel={() => setWritingFor(null)}
                    onSubmit={(fields) =>
                      save(
                        () =>
                          createReview({ booking_ref: stay.booking_ref, ...fields }),
                        "Thank you! Your review has been posted."
                      )
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="ua-panel">
          <h2 className="ua-panel-title">Your reviews</h2>

          <ul className="ua-reviews">
            {reviews.map((review) => (
              <li key={review.id} className="ua-review">
                {editingId === review.id ? (
                  <ReviewForm
                    initial={review}
                    submitLabel="Save review"
                    onCancel={() => setEditingId(null)}
                    onSubmit={(fields) =>
                      save(() => updateReview(review.id, fields), "Review updated")
                    }
                  />
                ) : (
                  <>
                    <div className="ua-review-head">
                      <div>
                        <strong>
                          {review.hotel_slug ? (
                            <Link to={`/hotel-details/${review.hotel_slug}`}>
                              {review.hotel_name || "Hotel"}
                            </Link>
                          ) : (
                            review.hotel_name || "Hotel"
                          )}
                        </strong>
                        <span className="ua-hint">
                          Reviewed on {formatDate(review.created_at)}
                        </span>
                      </div>
                      <StarRating value={review.rating} />
                    </div>

                    {review.title && <p className="ua-review-title">{review.title}</p>}
                    <p className="ua-review-text">{review.comment}</p>

                    <div className="ua-form-actions">
                      <button
                        type="button"
                        className="ua-link-btn"
                        onClick={() => {
                          setWritingFor(null);
                          setEditingId(review.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ua-link-btn ua-link-btn--danger"
                        onClick={() => handleDelete(review)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
