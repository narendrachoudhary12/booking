import popup from "../../common/Popup/popupService";
import { API_BASE } from "../../../config/api";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { StatusBadge, TierBadge } from "../ui/Badges";
import Pagination from "../ui/Pagination";
import { useHotelData } from "../../../context/HotelDataContext";
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
  const [selectedCity, setSelectedCity] = useState(""); // "" = all cities
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

  // Hotels hold a city_id; the names come from the cities list that the
  // app loads once (HotelDataContext)
  const { cities } = useHotelData();

  const cityNames = useMemo(
    () => Object.fromEntries(cities.map((c) => [c.id, c.name])),
    [cities]
  );

  // The API may send the city as a name, as an object, or only as city_id
  const cityName = (hotel) =>
    (typeof hotel.city === "string" ? hotel.city : hotel.city?.name) ||
    hotel.city_name ||
    cityNames[hotel.city_id] ||
    "";

  // Cities that have at least one hotel, A to Z
  const cityOptions = useMemo(
    () => [...new Set(hotels.map(cityName).filter(Boolean))].sort(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hotels, cityNames]
  );

  // Filter Hotels
  const filteredHotels = useMemo(() => {
    const text = search.trim().toLowerCase();

    return hotels.filter((hotel) => {
      const hotelName = hotel.name || hotel.hotel_name || "";
      const city = cityName(hotel);
      const tier = String(hotel.tier || 1);

      const matchesSearch =
        hotelName.toLowerCase().includes(text) ||
        city.toLowerCase().includes(text);

      const matchesCity = !selectedCity || city === selectedCity;

      const matchesTier =
        selectedTier === "All Tiers" ||
        tier === selectedTier;

      return matchesSearch && matchesCity && matchesTier;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotels, cityNames, search, selectedCity, selectedTier]);

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
  }, [search, selectedCity, selectedTier]);

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
          placeholder="Search hotel or city"
          className="s9-input"
          style={{ width: 220 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* City Filter */}
        <select
          className="s9-input"
          style={{
            padding: "8px 12px",
            fontSize: 13,
            width: "auto",
          }}
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
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

        {/* Shown only while a search or filter is on */}
        {(search || selectedCity || selectedTier !== "All Tiers") && (
          <button
            type="button"
            className="s9-btn s9-btn-outline"
            onClick={() => {
              setSearch("");
              setSelectedCity("");
              setSelectedTier("All Tiers");
            }}
          >
            ✕ Clear filters
          </button>
        )}

        <button
          className="s9-btn s9-btn-primary"
          onClick={() => onNav("add-hotel")}
          style={{ marginLeft: "auto" }}
        >
          + Add Hotel
        </button>
      </div>

      <div className="s9-card">
        <div style={{ overflowX: "auto" }}>
        <table className="s9-tbl" style={{ minWidth: 880 }}>
          {/* The hotel name takes the free space; the rest fit their content */}
          <colgroup>
            <col />
            <col style={{ width: 150 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 70 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 210 }} />
          </colgroup>
          <thead>
            <tr>
              <th>Hotel</th>
              <th>City</th>
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
                  colSpan="8"
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

                  <td>{cityName(h) || "—"}</td>

                  <td>
                    <TierBadge tier={h.tier || 1} />
                  </td>

                  <td>{h.rooms || h.total_rooms || 0}</td>

                  <td style={{ whiteSpace: "nowrap" }}>★ {h.rating || "0.0"}</td>

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

                  {/* The buttons sit in a div: a flex <td> breaks the row's height */}
                  <td>
                    <div style={{ display: "flex", gap: 5, whiteSpace: "nowrap" }}>
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
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
        </div>

        {!loading && (
          <Pagination
            page={currentPage}
            pageSize={hotelsPerPage}
            total={filteredHotels.length}
            onChange={handlePageChange}
            label="hotels"
          />
        )}
      </div>
    </div>
  );
}