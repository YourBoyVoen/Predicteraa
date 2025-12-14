import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
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

// Dummy user data type and example
export type User = {
  id: number;
  username: string;
  fullname: string;
  role: string; // e.g. 'admin', 'user'
  roleFullName: string; // e.g. 'Administrator', 'Regular User'
};

const dummyUsers: User[] = [
  { id: 1, username: "johndoe", fullname: "John Doe", role: "admin", roleFullName: "Administrator" },
  { id: 2, username: "janesmith", fullname: "Jane Smith", role: "user", roleFullName: "Regular User" },
  { id: 3, username: "alicebrown", fullname: "Alice Brown", role: "user", roleFullName: "Regular User" },
];

const UserList: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [newUser, setNewUser] = useState<{ username: string; fullname: string; role: string }>({ username: "", fullname: "", role: "" });
  const [showAddModal, setShowAddModal] = useState(false);

  // Map role to full name
  const getRoleFullName = (role: string) => {
    if (role === "admin") return "Administrator";
    if (role === "user") return "Regular User";
    return role;
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.fullname.trim() || !newUser.role.trim()) return;
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers([
      ...users,
      {
        id: nextId,
        username: newUser.username.trim(),
        fullname: newUser.fullname.trim(),
        role: newUser.role.trim(),
        roleFullName: getRoleFullName(newUser.role.trim()),
      },
    ]);
    setNewUser({ username: "", fullname: "", role: "" });
    setShowAddModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="font-bold">☰</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User List</h1>
              <p className="text-gray-600">Daftar seluruh user aplikasi</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-6">
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
              <input
                type="text"
                placeholder="Username"
                className="border rounded px-3 py-2 w-full mb-3"
                value={newUser.username}
                onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded px-3 py-2 w-full mb-3"
                value={newUser.fullname}
                onChange={e => setNewUser(u => ({ ...u, fullname: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Role (admin/user)"
                className="border rounded px-3 py-2 w-full mb-3"
                value={newUser.role}
                onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </ModalWrapper>
        )}
        <div className="bg-white rounded-xl shadow p-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Username</th>
                <th className="px-4 py-2 border-b">Full Name</th>
                <th className="px-4 py-2 border-b">Role Full Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border-b">{user.id}</td>
                  <td className="px-4 py-2 border-b">{user.username}</td>
                  <td className="px-4 py-2 border-b">{user.fullname}</td>
                  <td className="px-4 py-2 border-b">{user.roleFullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
