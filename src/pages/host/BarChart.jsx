// pages/host/BarChart.jsx
// Simple bar chart: one bar per item. items: [{ label, value, title }]

export default function BarChart({ items, height = 140, color = "var(--hd-green)" }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
      {items.map((item) => (
        <div key={item.label} style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
          <div style={{ height, display: "flex", alignItems: "flex-end" }}>
            <div
              title={item.title}
              style={{
                width: "100%",
                height: Math.max(2, Math.round((item.value / max) * height)),
                background: item.value > 0 ? color : "var(--hd-border)",
                borderRadius: "4px 4px 0 0",
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: "var(--hd-muted)", marginTop: 6 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
