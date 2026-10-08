import React, { useEffect, useState, useRef } from 'react'
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import BasicTablethird from "../../../components/tables/BasicTables/BasicTablethird";
import { useNavigate } from "react-router-dom";

function HotelRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvError, setCsvError] = useState(null);
  const [csvSuccess, setCsvSuccess] = useState(null);
  const [formData, setFormData] = useState({
    hotel_id: "", room_type: "", price_per_night: "",
    discount_price: "", max_guests: "", total_rooms: "", available_rooms: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const csvInputRef = useRef(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dhunobeats.com/api/admin/hotelRoom", {
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === true) {
        setRooms(result.data);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("API error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  // ── Filtering ──────────────────────────────────────────────────
  const filteredRooms = rooms.filter(room => {
    const q = searchQuery.toLowerCase();
    return (
      String(room.hotel_id ?? "").toLowerCase().includes(q) ||
      String(room.room_type ?? "").toLowerCase().includes(q) ||
      String(room.price_per_night ?? "").toLowerCase().includes(q) ||
      String(room.max_guests ?? "").toLowerCase().includes(q) ||
      String(room.total_rooms ?? "").toLowerCase().includes(q) ||
      String(room.available_rooms ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredRooms.length / rowsPerPage);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to page 1 on search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // ── Form ──────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const response = await fetch("https://dhunobeats.com/api/admin/hotelRoom", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.status === true) {
        setShowModal(false);
        setFormData({ hotel_id: "", room_type: "", price_per_night: "", discount_price: "", max_guests: "", total_rooms: "", available_rooms: "" });
        fetchRooms();
      } else {
        setFormError(result.message || "Failed to add room.");
      }
    } catch (err) {
      setFormError("Error: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // ── CSV ───────────────────────────────────────────────────────
  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV must have a header and at least one data row.");
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim());
      return headers.reduce((obj, h, i) => ({ ...obj, [h]: values[i] ?? "" }), {});
    });
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvError(null); setCsvSuccess(null); setCsvUploading(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      let successCount = 0, failCount = 0;
      for (const row of rows) {
        try {
          const res = await fetch("https://dhunobeats.com/api/admin/hotelRoom", {
            method: "POST",
            headers: { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" },
            body: JSON.stringify(row),
          });
          const result = await res.json();
          result.status === true ? successCount++ : failCount++;
        } catch { failCount++; }
      }
      setCsvSuccess(`✅ ${successCount} imported.${failCount > 0 ? ` ⚠️ ${failCount} failed.` : ""}`);
      fetchRooms();
    } catch (err) {
      setCsvError("CSV Error: " + err.message);
    } finally {
      setCsvUploading(false);
      e.target.value = "";
    }
  };

  const downloadSampleCSV = () => {
    const sample = [
      "hotel_id,room_type,price_per_night,discount_price,max_guests,total_rooms,available_rooms",
      "1,Deluxe,3500.00,3000.00,2,10,8",
      "1,Suite,7000.00,6500.00,4,5,3",
    ].join("\n");
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "sample_hotel_rooms.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Pagination helpers ────────────────────────────────────────
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <>
      <PageMeta title="Hotel Rooms | Admin Dashboard" description="Hotel Rooms list" />
      <PageBreadcrumb pageTitle="Hotel Rooms" />

      <div className="space-y-6">

        {/* ── Action Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {csvSuccess && <span className="text-sm text-green-600 font-medium">{csvSuccess}</span>}
            {csvError && <span className="text-sm text-red-500 font-medium">{csvError}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={downloadSampleCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              📄 Sample CSV
            </button>
            <label className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer">
              {csvUploading ? "⏳ Uploading..." : "⬆️ Import CSV"}
              <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} disabled={csvUploading} />
            </label>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
              + Add Room
            </button>
          </div>
        </div>

        {/* ── Table Card ── */}
        <ComponentCard title="Hotel Rooms List">

          {/* Search Bar */}
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="relative w-full max-w-sm">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by room type, hotel ID, price..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm text-gray-500">
              Showing {filteredRooms.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredRooms.length)} of {filteredRooms.length} rooms
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : filteredRooms.length === 0 ? (
            <div className="py-10 text-center text-gray-400">No rooms found{searchQuery ? ` for "${searchQuery}"` : ""}.</div>
          ) : (
            <BasicTablethird data={paginatedRooms} />
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-gray-400">…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[34px] rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </ComponentCard>
      </div>

      {/* ── Add Room Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Add New Hotel Room</h2>
              <button onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-xl leading-none">✕</button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Hotel ID *</label>
                  <input name="hotel_id" value={formData.hotel_id} onChange={handleFormChange} required type="number" min="1"
                    placeholder="e.g. 1"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Room Type *</label>
                  <input name="room_type" value={formData.room_type} onChange={handleFormChange} required
                    placeholder="e.g. Deluxe, Suite"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Price per Night (₹) *</label>
                  <input name="price_per_night" value={formData.price_per_night} onChange={handleFormChange} required type="number" min="0" step="0.01"
                    placeholder="e.g. 3500.00"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Discount Price (₹)</label>
                  <input name="discount_price" value={formData.discount_price} onChange={handleFormChange} type="number" min="0" step="0.01"
                    placeholder="e.g. 3000.00"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Max Guests *</label>
                  <input name="max_guests" value={formData.max_guests} onChange={handleFormChange} required type="number" min="1"
                    placeholder="e.g. 2"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Total Rooms *</label>
                  <input name="total_rooms" value={formData.total_rooms} onChange={handleFormChange} required type="number" min="1"
                    placeholder="e.g. 10"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Available *</label>
                  <input name="available_rooms" value={formData.available_rooms} onChange={handleFormChange} required type="number" min="0"
                    placeholder="e.g. 8"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
                  {formLoading ? "Saving..." : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default HotelRooms;