import { FaStar } from "react-icons/fa";

const STARS = [1, 2, 3, 4, 5];

// Shows a 1-5 star rating. Pass onChange to make it a clickable input.
// Colours come from the --star-on / --star-off CSS variables of the parent.
export default function StarRating({ value = 0, onChange, size = 18 }) {
  const style = (star) => ({
    color:
      star <= Math.round(value)
        ? "var(--star-on, #d4af37)"
        : "var(--star-off, rgba(140, 140, 140, 0.45))",
    fontSize: size,
  });

  if (!onChange) {
    return (
      <span
        role="img"
        aria-label={`${value} out of 5 stars`}
        style={{ display: "inline-flex", gap: 3 }}
      >
        {STARS.map((star) => (
          <FaStar key={star} style={style(star)} aria-hidden="true" />
        ))}
      </span>
    );
  }

  return (
    <span role="radiogroup" style={{ display: "inline-flex", gap: 4 }}>
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          style={{
            background: "none",
            border: "none",
            padding: 2,
            cursor: "pointer",
            lineHeight: 0,
          }}
        >
          <FaStar style={style(star)} />
        </button>
      ))}
    </span>
  );
}
