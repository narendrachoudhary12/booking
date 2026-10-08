import popup from "../../../components/common/Popup/popupService";
import React, { useEffect, useState } from 'react'
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import BasicTableOne from "../../../components/tables/BasicTables/BasicTableOne";

function City() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    state_id: "",
    country_id: "",
  });

  // ── Fetch cities ──────────────────────────────────────
  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://dhunobeats.com/api/admin/citiesData", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status) {
        setCities(result.data);
      } else {
        setError("Data load karne mein problem hui");
      }
    } catch (err) {
      setError("API error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://dhunobeats.com/api/admin/addCity", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          state_id: Number(formData.state_id),
          country_id: Number(formData.country_id),
        }),
      });
      const result = await response.json();
      if (result.status) {
        setSuccessMsg("City successfully add ho gayi!");
        setFormData({ name: "", image: "", state_id: "", country_id: "" });
        setShowModal(false);
        fetchCities(); // table refresh
      } else {
        popup.error(result.message || "City add nahi hui");
      }
    } catch (err) {
      popup.error("API error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── CSV Upload ────────────────────────────────────────
  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return popup.warning("Pehle CSV file select karo");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split("\n").filter((l) => l.trim() !== "");
      const headers = lines[0].split(",").map((h) => h.trim());

      const citiesToAdd = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const city = {};
        headers.forEach((h, idx) => {
          city[h] = values[idx];
        });
        citiesToAdd.push(city);
      }

      const token = localStorage.getItem("token");
      let successCount = 0;

      for (const city of citiesToAdd) {
        try {
          const res = await fetch("https://dhunobeats.com/api/admin/addCity", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: city.name,
              image: city.image,
              state_id: Number(city.state_id),
              country_id: Number(city.country_id),
            }),
          });
          const result = await res.json();
          if (result.status) successCount++;
        } catch (err) {
          console.error("CSV row error:", err);
        }
      }

      setSuccessMsg(`${successCount} cities CSV se add ho gayi!`);
      setCsvFile(null);
      fetchCities();
    };
    reader.readAsText(csvFile);
  };

  return (
    <>
      <PageMeta title="Cities | Admin Dashboard" description="Cities list" />
      <PageBreadcrumb pageTitle="Cities" />

      <div className="space-y-6">
        {successMsg && (
          <div className="px-4 py-3 text-green-700 bg-green-100 rounded-lg">
            {successMsg}
            <button className="ml-4 font-bold" onClick={() => setSuccessMsg("")}>✕</button>
          </div>
        )}

        <ComponentCard title="Cities List">

          {/* ── Top bar: Add + CSV ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            {/* CSV Upload */}
            <form onSubmit={handleCsvUpload} className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="text-sm text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Upload CSV
              </button>
            </form>

            {/* Add City Button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              + Add City
            </button>
          </div>

          {/* ── Table ── */}
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : (
            <BasicTableOne data={cities} />
          )}
        </ComponentCard>
      </div>

      {/* ── Add City Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl dark:bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Add New City
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  City Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Lagos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image URL
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  State ID
                </label>
                <input
                  type="number"
                  required
                  value={formData.state_id}
                  onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                  placeholder="e.g. 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country ID
                </label>
                <input
                  type="number"
                  required
                  value={formData.country_id}
                  onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                  placeholder="e.g. 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add City"}
                </button>
              </div>
            </form>

            {/* CSV Format Guide */}
            {/* <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                CSV Format:
              </p>
              <code className="text-xs text-gray-500">
                name,image,state_id,country_id<br />
                Lagos,https://img.url,1,1<br />
                Abuja,https://img.url,2,1
              </code>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default City;