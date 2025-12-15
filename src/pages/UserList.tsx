import React, { useState, useEffect } from "react";
import { Menu, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { usersApi, type User } from "../services/usersApi";
import { useSnackbar } from "../contexts/SnackbarContext";

// Modal Wrapper
const ModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        aria-label="Close modal"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

const UserList: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<{ username: string; password: string; fullname: string; role: string }>({ 
    username: "", 
    password: "",
    fullname: "", 
    role: "" 
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.getAll();
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users");
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Map role to full name
  const getRoleFullName = (role: string) => {
    if (role === "admin") return "Administrator";
    if (role === "user") return "Operator";
    return role;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.password.trim() || !newUser.fullname.trim() || !newUser.role.trim()) return;

    try {
      setAddingUser(true);
      await usersApi.register({
        username: newUser.username.trim(),
        password: newUser.password.trim(),
        fullname: newUser.fullname.trim(),
        role: newUser.role.trim(),
      });

      showSnackbar("User added successfully", "success");
      setNewUser({ username: "", password: "", fullname: "", role: "" });
      setShowAddModal(false);
      
      // Reload users
      await loadUsers();
    } catch (err) {
      console.error("Error adding user:", err);
      showSnackbar("Failed to add user", "error");
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await usersApi.delete(userId);
      showSnackbar("User deleted successfully", "success");
      // Reload users
      await loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      showSnackbar("Failed to delete user", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </button>
                <ChevronRight size={16} />
                <span className="text-gray-900 font-medium">Users</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-800">User List</h1>
              <p className="text-gray-600">Daftar seluruh user aplikasi</p>
            </div>
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            + Add User
          </button>
        </div>

        {showAddModal && (
          <ModalWrapper onClose={() => setShowAddModal(false)}>
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleAddUser}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="border rounded px-3 py-2 w-full"
                  value={newUser.fullname}
                  onChange={e => setNewUser(u => ({ ...u, fullname: e.target.value }))}
                  required
                  disabled={addingUser}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="border rounded px-3 py-2 w-full"
                  value={newUser.username}
                  onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))}
                  required
                  disabled={addingUser}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password (minimum 6 characters)"
                  className="border rounded px-3 py-2 w-full"
                  value={newUser.password}
                  onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
                  required
                  disabled={addingUser}
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required</p>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={newUser.role}
                  onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                  required
                  disabled={addingUser}
                >
                  <option value="">Select a role</option>
                  <option value="admin">Administrator</option>
                  <option value="user">Operator</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border"
                  onClick={() => setShowAddModal(false)}
                  disabled={addingUser}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={addingUser}
                >
                  {addingUser ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </ModalWrapper>
        )}
        
        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">ID</th>
                    <th className="text-left py-2 px-2">Username</th>
                    <th className="text-left py-2 px-2">Full Name</th>
                    <th className="text-left py-2 px-2">Role</th>
                    <th className="text-right py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2">{user.id}</td>
                      <td className="py-2 px-2">{user.username}</td>
                      <td className="py-2 px-2">{user.fullname}</td>
                      <td className="py-2 px-2">{getRoleFullName(user.role)}</td>
                      <td className="py-2 px-2 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
