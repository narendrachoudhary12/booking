
// components/admin/pages/UsersPage.jsx

import { API_BASE } from "../../../config/api";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] =
    useState(1);

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE}/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const usersData =
      response.data.data || [];

    const sortedUsers =
      usersData.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

    setUsers(sortedUsers);

  } catch (error) {
    console.error(
      "Error fetching users:",
      error
    );
  } finally {
    setLoading(false);
  }
};

  // Search Filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullText = `
        ${u.name || ""}
        ${u.email || ""}
        ${u.phone || ""}
      `.toLowerCase();

      return fullText.includes(
        search.toLowerCase()
      );
    });
  }, [users, search]);

  // Pagination
  const totalPages = Math.ceil(
    filteredUsers.length / usersPerPage
  );

  const indexOfLastUser =
    currentPage * usersPerPage;

  const indexOfFirstUser =
    indexOfLastUser - usersPerPage;

  const currentUsers =
    filteredUsers.slice(
      indexOfFirstUser,
      indexOfLastUser
    );

  // Reset Page
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div>
      {/* Header */}
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
          placeholder="Search users..."
          className="s9-input"
          style={{ width: 250 }}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* Refresh */}
        <button
          className="s9-btn s9-btn-outline"
          onClick={fetchUsers}
        >
          Refresh
        </button>

        {/* Export */}
        <button
          className="s9-btn s9-btn-primary"
          style={{ marginLeft: "auto" }}
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="s9-card">
        <table className="s9-tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((u, index) => (
                <tr key={u.id || index}>
                  {/* ID */}
                  <td>
                    <code className="s9-code">
                      #{u.id}
                    </code>
                  </td>

                  {/* User */}
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {u.name || "N/A"}
                    </div>
                  </td>

                  {/* Email */}
                  <td>
                    {u.email || "N/A"}
                  </td>

                  {/* Phone */}
                  <td>
                    {u.phone || "N/A"}
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`s9-badge ${
                        u.status === "active"
                          ? "badge-confirmed"
                          : "badge-pending"
                      }`}
                    >
                      {u.status || "active"}
                    </span>
                  </td>

                  {/* Created */}
                  <td>
                    {u.created_at
                      ? new Date(
                          u.created_at
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Actions */}
                  <td
                    style={{
                      display: "flex",
                      gap: 5,
                    }}
                  >
                    <button className="s9-btn s9-btn-outline s9-btn-sm">
                      View
                    </button>

                    <button className="s9-btn s9-btn-danger s9-btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading &&
          filteredUsers.length > 0 && (
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
              {/* Prev */}
              <button
                className="s9-btn s9-btn-outline s9-btn-sm"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                Prev
              </button>

              {/* Pages */}
              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    className={`s9-btn s9-btn-sm ${
                      currentPage ===
                      index + 1
                        ? "s9-btn-primary"
                        : "s9-btn-outline"
                    }`}
                    onClick={() =>
                      setCurrentPage(
                        index + 1
                      )
                    }
                  >
                    {index + 1}
                  </button>
                )
              )}

              {/* Next */}
              <button
                className="s9-btn s9-btn-outline s9-btn-sm"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
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
