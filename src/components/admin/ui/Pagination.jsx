// components/admin/ui/Pagination.jsx

// Page numbers to show: always the first and last page, the pages around the
// current one, and "…" for the gaps. E.g. page 12 of 226:
//   1 … 11 12 13 … 226
function pageList(current, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);

  // Near either end, show a longer run so the bar keeps the same width
  let from = Math.max(2, current - 1);
  let to = Math.min(pages - 1, current + 1);

  if (current <= 4) [from, to] = [2, 5];
  if (current >= pages - 3) [from, to] = [pages - 4, pages - 1];

  const list = [1];
  if (from > 2) list.push("gap-start");
  for (let page = from; page <= to; page++) list.push(page);
  if (to < pages - 1) list.push("gap-end");
  list.push(pages);

  return list;
}

/**
 * Props:
 *   page      current page (1-based)
 *   pageSize  rows per page
 *   total     number of rows in all pages
 *   onChange  (page) => void
 *   label     what the rows are, e.g. "hotels"
 */
export default function Pagination({ page, pageSize, total, onChange, label = "results" }) {
  const pages = Math.ceil(total / pageSize);

  if (total === 0) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        flexWrap: "wrap",
        borderTop: "1px solid var(--border)",
      }}
    >
      <span style={{ fontSize: 13, color: "var(--muted)" }}>
        Showing {first.toLocaleString()}–{last.toLocaleString()} of {total.toLocaleString()} {label}
      </span>

      {pages > 1 && (
        <nav aria-label="Pagination" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            className="s9-btn s9-btn-outline s9-btn-sm"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
          >
            Prev
          </button>

          {pageList(page, pages).map((item) =>
            typeof item === "string" ? (
              <span key={item} style={{ padding: "0 4px", color: "var(--muted)" }}>
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-current={item === page ? "page" : undefined}
                className={`s9-btn s9-btn-sm ${item === page ? "s9-btn-primary" : "s9-btn-outline"}`}
                style={{ minWidth: 34, justifyContent: "center" }}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            className="s9-btn s9-btn-outline s9-btn-sm"
            disabled={page === pages}
            onClick={() => onChange(page + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
