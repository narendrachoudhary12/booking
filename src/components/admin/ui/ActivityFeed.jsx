// components/admin/ui/ActivityFeed.jsx
import { timeAgo } from "../format";

// events: [{ type, color, text, time }], newest first
export default function ActivityFeed({ events }) {
  if (events.length === 0) {
    return <div style={{ color: "var(--muted)", fontSize: 13, padding: "8px 0" }}>Nothing has happened yet.</div>;
  }

  return events.map((event, i) => (
    <div key={i} className="s9-feed-item">
      <div className={`s9-feed-dot ${event.color}`} />
      <div className="s9-feed-text">{event.text}</div>
      <div className="s9-feed-time">{timeAgo(event.time)}</div>
    </div>
  ));
}
