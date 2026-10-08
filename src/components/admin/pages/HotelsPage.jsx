import popup from "../../common/Popup/popupService";
import { API_BASE } from "../../../config/api";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { StatusBadge, TierBadge } from "../ui/Badges";
import AddHotelPage from "./AddHotelPage";
import RoomsPage from "./RoomsPage";

export default function HotelsPage({ onNav }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit: jis hotel ko edit kar rahe hain wo yahan store hota hai
  const [editingHotel, setEditingHotel] = useState(null);

  // Rooms: jis hotel ke rooms dekh rahe hain
  const [roomsHotel, setRoomsHotel] = useState(null);

  // Search + Filters
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedTier, setSelectedTier] = useState("All Tiers");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 10;

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE}/admin/hotelData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === true) {
        setHotels(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic States
  const states = useMemo(() => {
    const allStates = hotels
      .map((hotel) => hotel.state)
      .filter(Boolean);

    return ["All States", ...new Set(allStates)];
  }, [hotels]);

  // Filter Hotels
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const hotelName = hotel.name || hotel.hotel_name || "";
      const city = hotel.city || "";
      const state = hotel.state || "";
      const tier = String(hotel.tier || 1);

      const matchesSearch =
        hotelName.toLowerCase().includes(search.toLowerCase()) ||
        city.toLowerCase().includes(search.toLowerCase()) ||
        state.toLowerCase().includes(search.toLowerCase());

      const matchesState =
        selectedState === "All States" ||
        state === selectedState;

      const matchesTier =
        selectedTier === "All Tiers" ||
        tier === selectedTier;

      return matchesSearch && matchesState && matchesTier;
    });
  }, [hotels, search, selectedState, selectedTier]);

  // Delete Hotel
  const handleDeleteHotel = async (id) => {
    const confirmDelete = await popup.confirm(
      "Are you sure you want to delete this hotel?",
      { title: "Delete hotel", confirmText: "Delete", danger: true }
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_BASE}/admin/deleteHotel/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Remove deleted hotel instantly
      setHotels((prev) => prev.filter((hotel) => hotel.id !== id));

      popup.success("Hotel deleted successfully");
    } catch (error) {
      console.error("Error deleting hotel:", error);

      popup.error("Failed to delete hotel");
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;

  const currentHotels = filteredHotels.slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedState, selectedTier]);

  // ─────────────────────────────────────────────────────────
  // EDIT MODE: same AddHotelPage form, purana data bhara hua.
  // (Ye check saare hooks ke BAAD hona chahiye.)
  // ─────────────────────────────────────────────────────────
  if (editingHotel) {
    return (
      <AddHotelPage
        key={editingHotel.id}
        hotel={editingHotel}
        onSaved={() => {
          setEditingHotel(null);
          fetchHotels(); // list refresh
        }}
        onCancel={() => setEditingHotel(null)}
      />
    );
  }

  // ROOMS MODE: is hotel ke rooms (list + add + edit + delete)
  if (roomsHotel) {
    return (
      <RoomsPage
        key={roomsHotel.id}
        hotel={roomsHotel}
        onBack={() => setRoomsHotel(null)}
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search hotels..."
          className="s9-input"
          style={{ width: 220 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Dynamic State Filter */}
        <select
          className="s9-input"
          style={{
            padding: "8px 12px",
            fontSize: 13,
            width: "auto",
          }}
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          {states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* Tier Filter */}
        <select
          className="s9-input"
          style={{
            padding: "8px 12px",
            fontSize: 13,
            width: "auto",
          }}
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
        >
          <option value="All Tiers">All Tiers</option>
          <option value="1">Tier 1 (API)</option>
          <option value="2">Tier 2 (Extranet)</option>
          <option value="3">Tier 3 (Manual)</option>
        </select>

        <button
          className="s9-btn s9-btn-primary"
          onClick={() => onNav("add-hotel")}
          style={{ marginLeft: "auto" }}
        >
          + Add Hotel
        </button>
      </div>

      <div className="s9-card">
        <table className="s9-tbl">
          <thead>
            <tr>
              <th>Hotel</th>
              <th>City</th>
              <th>State</th>
              <th>Tier</th>
              <th>Rooms</th>
              <th>Rating</th>
              <th>This Month</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : currentHotels.length > 0 ? (
              currentHotels.map((h, index) => (
                <tr key={h.id || index}>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {h.name || h.hotel_name}
                    </div>
                  </td>

                  <td>{h.city}</td>

                  <td>{h.state}</td>

                  <td>
                    <TierBadge tier={h.tier || 1} />
                  </td>

                  <td>{h.rooms || h.total_rooms || 0}</td>

                  <td>* {h.rating || "0.0"}</td>

                  <td
                    style={{
                      color: "var(--green)",
                      fontWeight: 600,
                    }}
                  >
                    N{h.revenue || "0"}
                  </td>

                  <td>
                    <StatusBadge status={h.status || "pending"} />
                  </td>

                  <td
                    style={{
                      display: "flex",
                      gap: 5,
                    }}
                  >
                    <button
                      type="button"
                      className="s9-btn s9-btn-outline s9-btn-sm"
                      onClick={() => {
                        console.log("EDIT HOTEL DATA:", h); // check ke baad hata sakte ho
                        setEditingHotel(h);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="s9-btn s9-btn-danger s9-btn-sm"
                      onClick={() => handleDeleteHotel(h.id)}
                    >
                      Delete
                    </button>

                    {/* Rooms button hamesha dikhega */}
                    <button
                      type="button"
                      className="s9-btn s9-btn-outline s9-btn-sm"
                      onClick={() => {
                        console.log("ROOMS CLICK:", h); // check ke baad hata sakte ho
                        setRoomsHotel(h);
                      }}
                    >
                      Rooms
                    </button>

                    {h.status === "pending" && (
                      <button
                        type="button"
                        className="s9-btn s9-btn-gold s9-btn-sm"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  No Hotels Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && filteredHotels.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              padding: 20,
              flexWrap: "wrap",
            }}
          >
            <button
              className="s9-btn s9-btn-outline s9-btn-sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`s9-btn s9-btn-sm ${
                  currentPage === index + 1
                    ? "s9-btn-primary"
                    : "s9-btn-outline"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="s9-btn s9-btn-outline s9-btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}