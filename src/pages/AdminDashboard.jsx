import { useEffect, useState } from "react";
import { fetchUsers, deleteUser, updateRole, logout } from "../api/adminApi";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (err) {
      showNotification("Unauthorized - Please login again", "error");
      setTimeout(() => navigate("/AdminLogin"), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const removeUser = async (id, userRole, userName) => {
    // Prevent deleting admin users
    if (userRole === "admin") {
      showNotification("Admin users cannot be deleted", "error");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    
    try {
      await deleteUser(id);
      showNotification(`User ${userName} deleted successfully`, "success");
      loadUsers();
    } catch (err) {
      showNotification("Failed to delete user", "error");
    }
  };

  const changeRole = async (id, role) => {
    try {
      await updateRole(id, role);
      showNotification(`Role updated to ${role}`, "success");
      loadUsers();
    } catch (err) {
      showNotification("Failed to update role", "error");
    }
  };

  const doLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("adminToken");
      navigate("/AdminLogin");
    } catch (err) {
      showNotification("Logout failed", "error");
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">
        ${type === "success" ? "✓" : "✗"}
      </div>
      <div class="notification-content">
        <div class="notification-message">${message}</div>
      </div>
    `;
    
    document.querySelector(".notification-container")?.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  };

  const exportUsers = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email,Company,Role\n"
        + users.map(user => 
            `"${user.name}","${user.email}","${user.company}","${user.role}"`
          ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `users_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification("Users exported successfully", "success");
    } catch (err) {
      showNotification("Failed to export users", "error");
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    activeAdmins: users.filter(u => u.role === "admin").length,
    regularUsers: users.filter(u => u.role === "user").length,
    companies: new Set(users.map(u => u.company)).size
  };

  return (
    <div className="admin-dashboard">
      {/* Notification Container */}
      <div className="notification-container"></div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay active">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            Loading Dashboard
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="logo-icon">B</div>
            <span>BrandInsight</span>
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="user-info">
            <h4>Administrator</h4>
            <span className="user-role">Super Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <a href="#users" onClick={(e) => e.preventDefault()}>
                <i className="fas fa-users"></i>
                <span>Users</span>
                <span className="badge">{stats.totalUsers}</span>
              </a>
            </li>
            <li>
              <a href="#settings" onClick={(e) => e.preventDefault()}>
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={doLogout} type="button">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1>Admin Dashboard</h1>
            <p className="breadcrumb">User Management</p>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-profile" type="button" onClick={doLogout}>
              <div className="profile-avatar">
                <i className="fas fa-sign-out-alt"></i>
              </div>
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.activeAdmins}</h3>
              <p>Administrators</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon warning">
              <i className="fas fa-user"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.regularUsers}</h3>
              <p>Regular Users</p>
            </div>
          </div>
          
        </div>

        {/* Users Table */}
        <div className="content-card">
          <div className="card-header">
            <h2>User Management</h2>
            <div className="card-actions">
              <button className="btn btn-outline" onClick={exportUsers} type="button">
                <i className="fas fa-download"></i>
                Export CSV
              </button>
              <button className="btn btn-outline" onClick={loadUsers} type="button">
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
            </div>
          </div>

          <div className="table-container">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-users-slash"></i>
                <h3>No users found</h3>
                <p>{searchTerm ? "Try adjusting your search" : "No users in the system"}</p>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar small">
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <div className="user-details">
                            <strong>{user.name || "Unknown User"}</strong>
                            <small>ID: {user.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <div className="company-cell">
                          <i className="fas fa-building"></i>
                          <span>{user.company || "N/A"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="role-select">
                          <select
                            value={user.role || "user"}
                            onChange={(e) => changeRole(user.id, e.target.value)}
                            className={`role-badge ${user.role || "user"}`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {user.role === "user" ? (
                            <button 
                              className="btn-action delete-btn"
                              onClick={() => removeUser(user.id, user.role, user.name)}
                              type="button"
                              title="Delete User"
                            >
                              <i className="fas fa-trash"></i>
                              Delete
                            </button>
                          ) : (
                            <button 
                              className="btn-action disabled-btn"
                              type="button"
                              title="Admin users cannot be deleted"
                              disabled
                            >
                              <i className="fas fa-ban"></i>
                              Protected
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          {filteredUsers.length > 0 && (
            <div className="table-footer">
              <div className="table-info">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>© 2025 BrandInsight Admin Panel. All rights reserved.</p>
          <p>Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </footer>
      </div>
    </div>
  );
}