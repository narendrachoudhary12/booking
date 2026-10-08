// components/admin/pages/PlaceholderPage.jsx

export default function PlaceholderPage({ title }) {
  return (
    <div className="s9-card">
      <div
        className="s9-card-body"
        style={{ padding: 48, textAlign: "center", color: "var(--muted)", fontSize: 14 }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>Under Construction</div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div>This section is coming soon.</div>
      </div>
    </div>
  );
}
