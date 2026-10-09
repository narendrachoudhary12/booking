// components/admin/pages/OwnersPage.jsx
// Hotel owners: approve hotels they ask to list, link an owner to an
// existing hotel, and see every partner account with its hotels.

import { useEffect, useState } from "react";
import popup from "../../common/Popup/popupService";
import {
  apiError,
  approveHotelRequest,
  assignHotelOwner,
  getHotelRequests,
  getOwners,
  rejectHotelRequest,
  searchOwnerHotels,
} from "../../../services/hostApi";

const REQUEST_FILTERS = ["pending", "approved", "rejected"];

const REQUEST_BADGE = {
  pending: "badge-pending",
  approved: "badge-confirmed",
  rejected: "badge-cancelled",
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const ownerLabel = (o) =>
  `${[o.name, o.last_name].filter(Boolean).join(" ")} — ${o.email}`;

const emptyCell = { textAlign: "center", padding: 24, color: "var(--muted)" };

// Photos an owner sent with a request (stored as a JSON list of URLs)
function requestPhotos(request) {
  try {
    const list = JSON.parse(request.images || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);

  // Hotel requests
  const [filter, setFilter] = useState("pending");
  const [requests, setRequests] = useState(null); // null = loading
  const [rejecting, setRejecting] = useState(null); // { id, note }
  const [busyId, setBusyId] = useState(null);

  // Link an owner to a hotel
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [chosenOwner, setChosenOwner] = useState({}); // hotel id -> owner id

  const loadOwners = () =>
    getOwners()
      .then(setOwners)
      .catch((error) => popup.error(apiError(error)));

  const loadRequests = () =>
    getHotelRequests(filter)
      .then(setRequests)
      .catch(() => setRequests([]));

  const runSearch = (term = search) =>
    searchOwnerHotels(term)
      .then(setResults)
      .catch(() => setResults([]));

  useEffect(() => {
    loadOwners();
  }, []);

  useEffect(() => {
    setRequests(null);
    loadRequests();
  }, [filter]);

  // Search as the admin types, after a short pause
  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => runSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Runs an API call, then reloads everything it could have changed
  const act = async (id, call, successMessage) => {
    setBusyId(id);

    try {
      await call();
      setRejecting(null);
      await Promise.all([loadRequests(), loadOwners()]);
      if (search.trim().length >= 2) await runSearch();
      popup.success(successMessage);
    } catch (error) {
      popup.error(apiError(error));
    }

    setBusyId(null);
  };

  const handleApprove = async (request) => {
    const ok = await popup.confirm(
      `Create "${request.name}" as a live hotel and link it to ${request.owner_email}?`
    );
    if (!ok) return;

    act(request.id, () => approveHotelRequest(request.id), "Hotel created and linked to the owner");
  };

  const handleLink = (hotel) => {
    const ownerId = Number(chosenOwner[hotel.id]);

    if (!ownerId) {
      popup.warning("Choose an owner first.");
      return;
    }

    act(`hotel-${hotel.id}`, () => assignHotelOwner(hotel.id, ownerId), "Owner linked to hotel");
  };

  const handleUnlink = async (hotel) => {
    if (!(await popup.confirm(`Remove the owner from "${hotel.name}"?`))) return;

    act(`hotel-${hotel.id}`, () => assignHotelOwner(hotel.id, null), "Owner removed from hotel");
  };

  return (
    <div>
      {/* ── Hotel requests ── */}
      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">Hotel requests from owners</div>
          <div style={{ display: "flex", gap: 6 }}>
            {REQUEST_FILTERS.map((f) => (
              <button
                key={f}
                className={`s9-btn s9-btn-sm ${filter === f ? "s9-btn-primary" : "s9-btn-outline"}`}
                onClick={() => setFilter(f)}
                style={{ textTransform: "capitalize" }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="s9-tbl">
            <thead>
              <tr>
                <th>Hotel</th>
                <th>City</th>
                <th>Owner</th>
                <th>Sent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!requests && (
                <tr><td colSpan={6} style={emptyCell}>Loading…</td></tr>
              )}

              {requests?.length === 0 && (
                <tr><td colSpan={6} style={emptyCell}>No {filter} requests.</td></tr>
              )}

              {requests?.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.name}</strong>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.address}</div>
                    {r.admin_note && (
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Note: {r.admin_note}</div>
                    )}
                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      {requestPhotos(r).map((url) => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={url}
                            alt=""
                            loading="lazy"
                            style={{ width: 56, height: 42, objectFit: "cover", borderRadius: 4 }}
                          />
                        </a>
                      ))}
                    </div>
                  </td>
                  <td>{r.city_name || "—"}</td>
                  <td>
                    {[r.owner_name, r.owner_last_name].filter(Boolean).join(" ") || "—"}
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.owner_email}</div>
                    {r.owner_business && (
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.owner_business}</div>
                    )}
                  </td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>
                    <span className={`s9-badge ${REQUEST_BADGE[r.status] || ""}`}>{r.status}</span>
                  </td>
                  <td>
                    {r.status !== "pending" ? (
                      "—"
                    ) : rejecting?.id === r.id ? (
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input
                          className="s9-input"
                          placeholder="Reason (optional)"
                          maxLength={500}
                          value={rejecting.note}
                          onChange={(e) => setRejecting({ id: r.id, note: e.target.value })}
                        />
                        <button
                          className="s9-btn s9-btn-danger s9-btn-sm"
                          disabled={busyId === r.id}
                          onClick={() =>
                            act(r.id, () => rejectHotelRequest(r.id, rejecting.note), "Request rejected")
                          }
                        >
                          Reject
                        </button>
                        <button className="s9-btn s9-btn-outline s9-btn-sm" onClick={() => setRejecting(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="s9-btn s9-btn-primary s9-btn-sm"
                          disabled={busyId === r.id}
                          onClick={() => handleApprove(r)}
                        >
                          Approve
                        </button>
                        <button
                          className="s9-btn s9-btn-outline s9-btn-sm"
                          onClick={() => setRejecting({ id: r.id, note: "" })}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Link an owner to an existing hotel ── */}
      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">Link an owner to an existing hotel</div>
        </div>

        <div className="s9-card-body">
          <input
            className="s9-input"
            style={{ width: "100%", maxWidth: 420 }}
            placeholder="Search a hotel by name (at least 2 letters)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {results.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="s9-tbl">
              <thead>
                <tr>
                  <th>Hotel</th>
                  <th>Current owner</th>
                  <th>Set owner</th>
                </tr>
              </thead>
              <tbody>
                {results.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <strong>{h.name}</strong>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{h.address}</div>
                    </td>
                    <td>
                      {h.owner_id ? (
                        <>
                          {h.owner_name}
                          <div style={{ fontSize: 12, color: "var(--muted)" }}>{h.owner_email}</div>
                        </>
                      ) : (
                        "No owner"
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <select
                          className="s9-input"
                          aria-label={`Owner for ${h.name}`}
                          value={chosenOwner[h.id] ?? h.owner_id ?? ""}
                          onChange={(e) => setChosenOwner({ ...chosenOwner, [h.id]: e.target.value })}
                        >
                          <option value="">Choose an owner</option>
                          {owners.map((o) => (
                            <option key={o.id} value={o.id}>{ownerLabel(o)}</option>
                          ))}
                        </select>
                        <button
                          className="s9-btn s9-btn-primary s9-btn-sm"
                          disabled={busyId === `hotel-${h.id}`}
                          onClick={() => handleLink(h)}
                        >
                          Save
                        </button>
                        {h.owner_id && (
                          <button
                            className="s9-btn s9-btn-outline s9-btn-sm"
                            disabled={busyId === `hotel-${h.id}`}
                            onClick={() => handleUnlink(h)}
                          >
                            Remove owner
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {search.trim().length >= 2 && results.length === 0 && (
          <div style={{ padding: "0 20px 20px", color: "var(--muted)", fontSize: 13 }}>
            No hotels found for “{search.trim()}”.
          </div>
        )}
      </div>

      {/* ── All partner accounts ── */}
      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">Hotel owner accounts ({owners.length})</div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="s9-tbl">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Business</th>
                <th>Phone</th>
                <th>Hotels</th>
              </tr>
            </thead>
            <tbody>
              {owners.length === 0 && (
                <tr><td colSpan={4} style={emptyCell}>No hotel owner accounts yet.</td></tr>
              )}

              {owners.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>{[o.name, o.last_name].filter(Boolean).join(" ")}</strong>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{o.email}</div>
                  </td>
                  <td>{o.business_name || "—"}</td>
                  <td>{o.phone || "—"}</td>
                  <td>
                    {o.hotels.length > 0
                      ? o.hotels.map((h) => h.name).join(", ")
                      : "None linked"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
