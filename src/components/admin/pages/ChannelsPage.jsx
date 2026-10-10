// components/admin/pages/ChannelsPage.jsx
// Channel manager details hotel owners have saved. An admin checks them and
// switches each connection on or off.

import popup from "../../common/Popup/popupService";
import useLoad from "../../../hooks/useLoad";
import { apiError, getChannels, setChannelStatus } from "../../../services/adminApi";
import { shortDate } from "../format";
import Loadable from "../ui/Loadable";

const BADGE = { active: "confirmed", pending: "pending", disabled: "cancelled" };

export default function ChannelsPage({ onChanged }) {
  const { data: channels, error, reload } = useLoad(getChannels, [], apiError);

  const change = async (channel, status) => {
    try {
      await setChannelStatus(channel.hotel_id, status);
      await reload();
      onChanged?.();
    } catch (err) {
      popup.error(apiError(err));
    }
  };

  return (
    <div className="s9-card">
      <div className="s9-card-head">
        <div className="s9-card-title">Hotel channel managers</div>
      </div>

      <Loadable data={channels} error={error}>
        <div style={{ overflowX: "auto" }}>
          <table className="s9-tbl">
            <thead>
              <tr>
                <th>Hotel</th><th>Owner</th><th>Provider</th><th>Property ID</th>
                <th>Last change</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {channels?.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>
                    No hotel has added channel manager details yet.
                  </td>
                </tr>
              )}
              {channels?.map((c) => (
                <tr key={c.hotel_id}>
                  <td style={{ fontWeight: 500 }}>{c.hotel_name}</td>
                  <td>
                    {c.owner_name || "—"}
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.owner_email || ""}</div>
                  </td>
                  <td><span className="s9-tag">{c.provider}</span></td>
                  <td><code className="s9-code">{c.property_id}</code></td>
                  <td>{shortDate(c.updated_at)}</td>
                  <td><span className={`s9-badge badge-${BADGE[c.status] || "pending"}`}>{c.status}</span></td>
                  <td>
                    {c.status === "active" ? (
                      <button className="s9-btn s9-btn-danger s9-btn-sm" onClick={() => change(c, "disabled")}>
                        Switch off
                      </button>
                    ) : (
                      <button className="s9-btn s9-btn-gold s9-btn-sm" onClick={() => change(c, "active")}>
                        Switch on
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Loadable>
    </div>
  );
}
