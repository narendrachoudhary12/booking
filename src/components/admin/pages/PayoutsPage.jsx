// components/admin/pages/PayoutsPage.jsx
// What each hotel is owed for finished stays, and the payouts already made.

import { useState } from "react";
import popup from "../../common/Popup/popupService";
import useLoad from "../../../hooks/useLoad";
import { apiError, createPayout, getPayouts } from "../../../services/adminApi";
import { money, shortDate } from "../format";
import Loadable from "../ui/Loadable";
import Modal from "../ui/Modal";

function PayoutModal({ hotel, onClose, onDone }) {
  const [form, setForm] = useState({ reference: "", note: "" });
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async () => {
    setBusy(true);

    try {
      await createPayout({ hotel_id: hotel.hotel_id, ...form });
      popup.success(`Payout to ${hotel.hotel_name} recorded`);
      onClose();
      onDone();
    } catch (err) {
      popup.error(apiError(err));
    }

    setBusy(false);
  };

  return (
    <Modal title={`Pay ${hotel.hotel_name}`} submitText="Record payout" busy={busy} onClose={onClose} onSubmit={handleSubmit}>
      <div className="s9-alert s9-alert-gold">
        <span>⚠️</span>
        <span>
          Send {money(hotel.net)} to the hotel first, then record it here. This
          covers {hotel.bookings} finished stay{hotel.bookings === 1 ? "" : "s"}: {money(hotel.gross)} minus{" "}
          {hotel.commission_percent}% commission ({money(hotel.commission)}).
        </span>
      </div>

      <div className="s9-form-row full">
        <div className="s9-form-group">
          <label className="s9-label">Transfer reference</label>
          <input className="s9-input" value={form.reference} onChange={set("reference")} placeholder="Bank transaction ID" required />
        </div>
      </div>

      <div className="s9-form-row full">
        <div className="s9-form-group">
          <label className="s9-label">Note (optional)</label>
          <input className="s9-input" value={form.note} onChange={set("note")} maxLength={500} />
        </div>
      </div>
    </Modal>
  );
}

export default function PayoutsPage({ onChanged }) {
  const { data, error, reload } = useLoad(getPayouts, [], apiError);
  const [paying, setPaying] = useState(null); // the hotel row being paid

  const handleDone = () => {
    reload();
    onChanged?.();
  };

  return (
    <Loadable data={data} error={error}>
      {data && (
        <div>
          <div className="s9-card">
            <div className="s9-card-head">
              <div className="s9-card-title">Payouts due</div>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                Total: <strong>{money(data.due.reduce((sum, h) => sum + h.net, 0))}</strong>
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="s9-tbl">
                <thead>
                  <tr>
                    <th>Hotel</th><th>Owner</th><th>Finished stays</th>
                    <th>Booking total</th><th>Commission</th><th>To pay</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.due.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>
                        Nothing to pay out. A stay is owed to the hotel after the guest checks out.
                      </td>
                    </tr>
                  )}
                  {data.due.map((h) => (
                    <tr key={h.hotel_id}>
                      <td style={{ fontWeight: 500 }}>{h.hotel_name}</td>
                      <td>
                        {h.owner_name || "No owner linked"}
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{h.owner_email || h.owner_phone || ""}</div>
                      </td>
                      <td>{h.bookings}</td>
                      <td>{money(h.gross)}</td>
                      <td>{money(h.commission)} ({h.commission_percent}%)</td>
                      <td style={{ fontWeight: 600, color: "var(--green)" }}>{money(h.net)}</td>
                      <td>
                        <button className="s9-btn s9-btn-gold s9-btn-sm" onClick={() => setPaying(h)}>
                          Record payout
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="s9-card">
            <div className="s9-card-head">
              <div className="s9-card-title">Payout history</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="s9-tbl">
                <thead>
                  <tr>
                    <th>Date</th><th>Hotel</th><th>Stays</th><th>Booking total</th>
                    <th>Commission</th><th>Paid</th><th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>
                        No payouts recorded yet.
                      </td>
                    </tr>
                  )}
                  {data.history.map((p) => (
                    <tr key={p.id}>
                      <td>{shortDate(p.paid_at)}</td>
                      <td style={{ fontWeight: 500 }}>{p.hotel_name || "Hotel removed"}</td>
                      <td>{p.bookings_count}</td>
                      <td>{money(p.gross_amount)}</td>
                      <td>{money(p.commission_amount)}</td>
                      <td style={{ fontWeight: 600 }}>{money(p.net_amount)}</td>
                      <td>
                        <code className="s9-code">{p.reference}</code>
                        {p.note && <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.note}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {paying && <PayoutModal hotel={paying} onClose={() => setPaying(null)} onDone={handleDone} />}
        </div>
      )}
    </Loadable>
  );
}
