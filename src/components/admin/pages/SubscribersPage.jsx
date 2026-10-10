// components/admin/pages/SubscribersPage.jsx
// Emails collected by the "unlock hotel deals" form on the website.

import { useState } from "react";
import Papa from "papaparse";
import popup from "../../common/Popup/popupService";
import useLoad from "../../../hooks/useLoad";
import { apiError, deleteSubscriber, getSubscribers } from "../../../services/adminApi";
import { shortDate } from "../format";
import Loadable from "../ui/Loadable";

function exportCsv(subscribers) {
  const csv = Papa.unparse(
    subscribers.map((s) => ({
      Email: s.email,
      Account: s.user_name || "",
      "Signed up on": s.created_at,
      Page: s.source || "",
    }))
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `stay9ja-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function SubscribersPage() {
  const [search, setSearch] = useState("");

  const { data: subscribers, error, reload } = useLoad(
    () => getSubscribers(search),
    [search],
    apiError
  );

  const handleDelete = async (subscriber) => {
    const sure = await popup.confirm(`Remove ${subscriber.email} from the list?`, {
      danger: true,
      confirmText: "Remove",
    });
    if (!sure) return;

    try {
      await deleteSubscriber(subscriber.id);
      await reload();
    } catch (err) {
      popup.error(apiError(err));
    }
  };

  return (
    <div className="s9-card" style={{ maxWidth: 900 }}>
      <div className="s9-card-head">
        <div className="s9-card-title">
          Deal subscribers{subscribers ? ` (${subscribers.length})` : ""}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="s9-input"
            style={{ padding: "6px 10px", fontSize: 13, width: 200 }}
            type="search"
            placeholder="Search email"
            onKeyDown={(e) => e.key === "Enter" && setSearch(e.target.value.trim())}
            onBlur={(e) => setSearch(e.target.value.trim())}
          />
          <button
            className="s9-btn s9-btn-outline s9-btn-sm"
            disabled={!subscribers?.length}
            onClick={() => exportCsv(subscribers)}
          >
            Export CSV
          </button>
        </div>
      </div>

      <Loadable data={subscribers} error={error}>
        <table className="s9-tbl">
          <thead>
            <tr><th>Email</th><th>Account</th><th>Signed up</th><th>Page</th><th></th></tr>
          </thead>
          <tbody>
            {subscribers?.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>
                  {search ? "No subscriber matches this search." : "Nobody has signed up yet."}
                </td>
              </tr>
            )}
            {subscribers?.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.email}</td>
                <td>{s.user_name || "—"}</td>
                <td>{shortDate(s.created_at)}</td>
                <td>{s.source || "—"}</td>
                <td>
                  <button className="s9-btn s9-btn-outline s9-btn-sm" onClick={() => handleDelete(s)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Loadable>
    </div>
  );
}
