// pages/host/Loadable.jsx
// Shows "Loading…" or the error until a page's data has arrived.

export default function Loadable({ data, error, children }) {
  if (error) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--hd-red)" }}>{error}</div>;
  }

  if (!data) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--hd-muted)" }}>Loading…</div>;
  }

  return children;
}
