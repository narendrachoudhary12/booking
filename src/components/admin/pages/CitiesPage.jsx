import popup from "../../common/Popup/popupService";
import { API_BASE } from "../../../config/api";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = API_BASE;

const emptyForm = {
  name: "",
  image: "",
  description: "",
  status: 1,
};

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Add / Edit
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    ...emptyForm,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const citiesPerPage = 10;

  // =========================
  // HEADERS
  // =========================

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  };

  // =========================
  // FETCH CITIES
  // GET /api/admin/cities
  // =========================

  const fetchCities = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/cities`,
        {
          headers: getHeaders(),
        }
      );

      console.log(
        "Cities API Response:",
        response.data
      );

      if (Array.isArray(response.data)) {
        setCities(response.data);
      } else if (
        Array.isArray(response.data?.data)
      ) {
        setCities(response.data.data);
      } else if (
        Array.isArray(response.data?.cities)
      ) {
        setCities(response.data.cities);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error(
        "Error fetching cities:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "API Error:",
        error.response?.data
      );

      popup.error(
        error.response?.data?.message ||
          "Failed to load cities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // =========================
  // ADD CITY
  // =========================

  const handleAddCity = () => {
    setEditingCity(null);

    setFormData({
      ...emptyForm,
    });

    setShowForm(true);
  };

  // =========================
  // EDIT CITY
  // GET /api/admin/cities/{id}
  // =========================

  const handleEdit = async (city) => {
    // Show form immediately
    setEditingCity(city);

    setFormData({
      name: city.name || "",
      image: city.image || "",
      description:
        city.description || "",
      status:
        city.status === 1 ||
        city.status === "1" ||
        city.status === "active" ||
        city.status === true
          ? 1
          : 0,
    });

    setShowForm(true);

    // Fetch latest details
    try {
      const response = await axios.get(
        `${API_URL}/cities/${city.id}`,
        {
          headers: getHeaders(),
        }
      );

      console.log(
        "City Details Response:",
        response.data
      );

      const data =
        response.data?.data ||
        response.data?.city ||
        response.data;

      if (data) {
        setFormData({
          name: data.name || "",
          image: data.image || "",
          description:
            data.description || "",
          status:
            data.status === 1 ||
            data.status === "1" ||
            data.status === "active" ||
            data.status === true
              ? 1
              : 0,
        });
      }
    } catch (error) {
      console.error(
        "City Details Error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );
    }
  };

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "status"
          ? Number(value)
          : value,
    }));
  };

  // =========================
  // CANCEL FORM
  // =========================

  const handleCancel = () => {
    setShowForm(false);
    setEditingCity(null);

    setFormData({
      ...emptyForm,
    });
  };

  // =========================
  // ADD / UPDATE CITY
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      popup.warning("Please enter city name.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem(
        "token"
      );

      const payload = {
        name: formData.name.trim(),
        image:
          formData.image?.trim() || null,
        description:
          formData.description?.trim() ||
          null,
        status: Number(formData.status),
      };

      console.log(
        "City Payload:",
        payload
      );

      let response;

      // =========================
      // ADD
      // POST /api/admin/citiesstore
      // =========================

      if (!editingCity) {
        response = await axios.post(
          `${API_URL}/admin/citiesstore`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept:
                "application/json",
              "Content-Type":
                "application/json",
            },
          }
        );

        console.log(
          "Add City Response:",
          response.data
        );

        popup.success(
          "City added successfully."
        );
      }

      // =========================
      // UPDATE
      // PUT /api/admin/cities/{id}
      // =========================

      else {
        response = await axios.put(
          `${API_URL}/admin/citiesupdate/${editingCity.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept:
                "application/json",
              "Content-Type":
                "application/json",
            },
          }
        );

        console.log(
          "Update City Response:",
          response.data
        );

        popup.success(
          "City updated successfully."
        );
      }

      // Close form
      setShowForm(false);
      setEditingCity(null);

      setFormData({
        ...emptyForm,
      });

      // Refresh list
      await fetchCities();

    } catch (error) {
      console.error(
        "Save City Error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      // Laravel validation errors
      if (
        error.response?.data?.errors
      ) {
        const errors =
          error.response.data.errors;

        const messages =
          Object.values(errors)
            .flat()
            .join("\n");

        popup.error(messages);
      } else {
        popup.error(
          error.response?.data?.message ||
            "Failed to save city."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE CITY
  // DELETE /api/admin/citiesdelete/{id}
  // =========================

  const handleDelete = async (id) => {
    const confirmed = await popup.confirm(
      "Are you sure you want to delete this city?",
      { title: "Delete city", confirmText: "Delete", danger: true }
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem(
        "token"
      );

      console.log(
        "Deleting City:",
        id
      );

      const response =
        await axios.delete(
          `${API_URL}/admin/citiesdelete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

      console.log(
        "Delete City Response:",
        response.data
      );

      // Remove from current list
      setCities((prevCities) =>
        prevCities.filter(
          (city) =>
            city.id !== id
        )
      );

      popup.success(
        "City deleted successfully."
      );

    } catch (error) {
      console.error(
        "Delete City Error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      popup.error(
        error.response?.data?.message ||
          "Failed to delete city."
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredCities = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return cities;
    }

    return cities.filter((city) => {
      const name = String(
        city.name || ""
      ).toLowerCase();

      const description = String(
        city.description || ""
      ).toLowerCase();

      return (
        name.includes(searchText) ||
        description.includes(searchText)
      );
    });
  }, [cities, search]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredCities.length /
      citiesPerPage
  );

  const indexOfLastCity =
    currentPage * citiesPerPage;

  const indexOfFirstCity =
    indexOfLastCity -
    citiesPerPage;

  const currentCities =
    filteredCities.slice(
      indexOfFirstCity,
      indexOfLastCity
    );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // =========================
  // ADD / EDIT FORM PAGE
  // =========================

  if (showForm) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "none",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            marginBottom: 20,
            width: "100%",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
              }}
            >
              {editingCity
                ? "Edit City"
                : "Add City"}
            </h2>

            <div
              style={{
                marginTop: 5,
                color:
                  "var(--muted)",
                fontSize: 13,
              }}
            >
              {editingCity
                ? "Update city information"
                : "Create a new city"}
            </div>
          </div>

          <button
            type="button"
            className="s9-btn s9-btn-outline"
            onClick={handleCancel}
          >
            ← Back to Cities
          </button>
        </div>

        {/* FULL WIDTH CARD */}
        <div
          className="s9-card"
          style={{
            width: "100%",
            maxWidth: "none",
            boxSizing:
              "border-box",
            padding: 28,
          }}
        >
          <form
            onSubmit={handleSubmit}
          >
            {/* FORM GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 24,
              }}
            >
              {/* NAME */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  City Name *
                </label>

                <input
                  type="text"
                  name="name"
                  className="s9-input"
                  placeholder="Enter city name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                  }}
                />
              </div>

              {/* IMAGE */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  className="s9-input"
                  placeholder="Enter image URL"
                  value={
                    formData.image
                  }
                  onChange={
                    handleChange
                  }
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                  }}
                />
              </div>

              {/* DESCRIPTION */}
              <div
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Description
                </label>

                <textarea
                  name="description"
                  className="s9-input"
                  placeholder="Enter city description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={7}
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    resize:
                      "vertical",
                  }}
                />
              </div>

              {/* STATUS */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Status
                </label>

                <select
                  name="status"
                  className="s9-input"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                  }}
                >
                  <option value={1}>
                    Active
                  </option>

                  <option value={0}>
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* IMAGE PREVIEW */}
            {formData.image && (
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop:
                    "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  Image Preview
                </div>

                <img
                  src={
                    formData.image
                  }
                  alt="City Preview"
                  style={{
                    width: 180,
                    height: 120,
                    objectFit:
                      "cover",
                    borderRadius: 8,
                    display:
                      "block",
                  }}
                  onError={(
                    e
                  ) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            )}

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 28,
                paddingTop: 20,
                borderTop:
                  "1px solid var(--border)",
              }}
            >
              <button
                type="submit"
                className="s9-btn s9-btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingCity
                  ? "Update City"
                  : "Save City"}
              </button>

              <button
                type="button"
                className="s9-btn s9-btn-outline"
                onClick={
                  handleCancel
                }
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // CITIES LIST
  // =========================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "none",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {/* SEARCH */}
        <input
          type="text"
          className="s9-input"
          placeholder="Search city..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            padding:
              "8px 12px",
            fontSize: 13,
            maxWidth: 250,
          }}
        />

        {/* REFRESH */}
        <button
          className="s9-btn s9-btn-outline"
          onClick={
            fetchCities
          }
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "Refresh"}
        </button>

        {/* ADD CITY */}
        <button
          className="s9-btn s9-btn-primary"
          style={{
            marginLeft:
              "auto",
          }}
          onClick={
            handleAddCity
          }
        >
          + Add City
        </button>
      </div>

      {/* TABLE CARD */}
      <div
        className="s9-card"
        style={{
          width: "100%",
          maxWidth: "none",
          boxSizing:
            "border-box",
        }}
      >
        <table className="s9-tbl">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign:
                      "center",
                    padding: 20,
                  }}
                >
                  Loading Cities...
                </td>
              </tr>
            ) : currentCities.length >
              0 ? (
              currentCities.map(
                (city, index) => {
                  const isActive =
                    city.status ===
                      1 ||
                    city.status ===
                      "1" ||
                    city.status ===
                      "active" ||
                    city.status ===
                      true;

                  return (
                    <tr
                      key={
                        city.id ||
                        index
                      }
                    >
                      {/* S.NO */}
                      <td>
                        {indexOfFirstCity +
                          index +
                          1}
                      </td>

                      {/* NAME */}
                      <td>
                        <div
                          style={{
                            fontWeight:
                              600,
                          }}
                        >
                          {city.name ||
                            "N/A"}
                        </div>
                      </td>

                      {/* IMAGE */}
                      <td>
                        {city.image ? (
                          <img
                            src={
                              city.image
                            }
                            alt={
                              city.name ||
                              "City"
                            }
                            style={{
                              width: 55,
                              height: 40,
                              objectFit:
                                "cover",
                              borderRadius:
                                6,
                              display:
                                "block",
                            }}
                            onError={(
                              e
                            ) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 12,
                              color:
                                "var(--muted)",
                            }}
                          >
                            No Image
                          </span>
                        )}
                      </td>

                      {/* DESCRIPTION */}
                      <td>
                        <div
                          style={{
                            maxWidth: 350,
                            whiteSpace:
                              "nowrap",
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                            color:
                              "var(--muted)",
                          }}
                          title={
                            city.description ||
                            ""
                          }
                        >
                          {city.description ||
                            "N/A"}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className="s9-tag"
                          style={{
                            color:
                              isActive
                                ? "var(--green)"
                                : "var(--red)",
                          }}
                        >
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* EDIT */}
                      <td>
                        <button
                          className="s9-btn s9-btn-outline s9-btn-sm"
                          onClick={() =>
                            handleEdit(
                              city
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>

                      {/* DELETE */}
                      <td>
                        <button
                          className="s9-btn s9-btn-danger s9-btn-sm"
                          onClick={() =>
                            handleDelete(
                              city.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign:
                      "center",
                    padding: 20,
                  }}
                >
                  No Cities Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {!loading &&
          filteredCities.length >
            0 && (
            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                gap: 10,
                padding: 20,
                flexWrap:
                  "wrap",
              }}
            >
              {/* PREV */}
              <button
                className="s9-btn s9-btn-outline s9-btn-sm"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage -
                      1
                  )
                }
              >
                Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentPage(
                        index +
                          1
                      )
                    }
                    className={`s9-btn s9-btn-sm ${
                      currentPage ===
                      index + 1
                        ? "s9-btn-primary"
                        : "s9-btn-outline"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}

              {/* NEXT */}
              <button
                className="s9-btn s9-btn-outline s9-btn-sm"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage +
                      1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
