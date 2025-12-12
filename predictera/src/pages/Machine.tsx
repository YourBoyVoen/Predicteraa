import React, { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";

type Machine = {
  id: string;
  name: string;
  type?: string;
  endpoint?: string;
  description?: string;
  health: "Healthy" | "Warning" | "Critical" | string;
  performance: number;
  updated: string;
};

type ModalWrapperProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const MachinePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Machine | null>(null);
  const [showEditModal, setShowEditModal] = useState<Machine | null>(null);

  // Dummy data
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: "1",
      name: "PredictAgent Model V1",
      health: "Healthy",
      performance: 92,
      updated: "2 minutes ago",
      type: "LLM",
      endpoint: "/api/model/v1",
      description: "Main prediction model",
    },
    {
      id: "2",
      name: "Forecasting Model",
      health: "Warning",
      performance: 67,
      updated: "10 minutes ago",
      type: "Time Series",
      endpoint: "/api/forecast",
      description: "Forecasting traffic model",
    },
  ]);

  // Add Machine Form
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: "",
    type: "",
    endpoint: "",
    description: "",
  });

  // ADD MACHINE
  const addMachine = () => {
    if (!newMachine.name || !newMachine.name.trim()) return;

    const created: Machine = {
      id: Date.now().toString(),
      name: newMachine.name!.trim(),
      type: newMachine.type || "Unknown",
      endpoint: newMachine.endpoint || "-",
      description: newMachine.description || "-",
      health: "Healthy",
      performance: 0,
      updated: "just now",
    };

    setMachines((prev) => [...prev, created]);

    setShowAddModal(false);
    setNewMachine({ name: "", type: "", endpoint: "", description: "" });
  };

  // DELETE MACHINE
  const deleteMachine = (id: string) => {
    setMachines((prev) => prev.filter((m) => m.id !== id));
  };

  // EDIT MACHINE: save changes from showEditModal
  const saveEditMachine = () => {
    if (!showEditModal) return;
    setMachines((prev) =>
      prev.map((m) => (m.id === showEditModal.id ? { ...showEditModal } : m))
    );
    setShowEditModal(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 pt-24 md:pt-40 relative">
        {/* Top Bar Mobile */}
        <div className="absolute top-6 left-6 md:left-10 flex items-center gap-3 md:hidden">
          <button
            className="p-2 bg-white shadow rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* Title */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Machine Settings</h1>
            <p className="text-gray-600">Manage your machines & performance</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow"
          >
            <Plus className="w-4 h-4" />
            Add Machine
          </button>
        </div>

        {/* Machine List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {machines.map((m) => (
            <MachineCard
              key={m.id}
              machine={m}
              onDetail={() => setShowDetailModal(m)}
              onEdit={() => setShowEditModal(m)}
              onDelete={() => deleteMachine(m.id)}
            />
          ))}
        </div>
      </div>

      {/* ADD MACHINE MODAL */}
      {showAddModal && (
        <ModalWrapper onClose={() => setShowAddModal(false)}>
          <h2 className="text-xl font-bold mb-4">Add New Machine</h2>

          <MachineForm
            machine={newMachine}
            setMachine={(upd) =>
              setNewMachine((prev) => ({ ...prev, ...upd }))
            }
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              className="px-4 py-2 rounded-xl border"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              onClick={addMachine}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Machine
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && (
        <ModalWrapper onClose={() => setShowDetailModal(null)}>
          <h2 className="text-xl font-bold mb-2">{showDetailModal.name}</h2>

          <p className="text-gray-700 mb-2">
            <strong>Type:</strong> {showDetailModal.type}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Endpoint:</strong> {showDetailModal.endpoint}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Description:</strong> {showDetailModal.description}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Health:</strong> {showDetailModal.health}
          </p>
          <p className="text-gray-700">
            <strong>Performance:</strong> {showDetailModal.performance}%
          </p>
        </ModalWrapper>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <ModalWrapper onClose={() => setShowEditModal(null)}>
          <h2 className="text-xl font-bold mb-4">Edit Machine</h2>

          <MachineForm
            machine={showEditModal}
            setMachine={(upd) =>
              setShowEditModal((prev) => (prev ? { ...prev, ...upd } : prev))
            }
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              className="px-4 py-2 rounded-xl border"
              onClick={() => setShowEditModal(null)}
            >
              Cancel
            </button>
            <button
              onClick={saveEditMachine}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────── */
/* MACHINE CARD */
/* ─────────────────────────────────────────────── */

type MachineCardProps = {
  machine: Machine;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const MachineCard: React.FC<MachineCardProps> = ({ machine, onDetail, onEdit, onDelete }) => {
  const healthColor =
    machine.health === "Healthy"
      ? "bg-green-100 text-green-700"
      : machine.health === "Warning"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold cursor-pointer" onClick={onDetail}>
          {machine.name}
        </h3>

        <div className="flex gap-2">
          <button onClick={onEdit} aria-label={`Edit ${machine.name}`}>
            <Pencil className="w-5 h-5 text-blue-600 hover:text-blue-800" />
          </button>
          <button onClick={onDelete} aria-label={`Delete ${machine.name}`}>
            <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
          </button>
        </div>
      </div>

      <div className={`inline-block px-3 py-1 text-sm rounded-full mt-3 ${healthColor}`}>
        {machine.health}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Performance</span>
          <span className="font-semibold">{machine.performance}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: `${machine.performance}%` }}
          />
        </div>
      </div>
      <button
        onClick={() => window.location.href = `/agent?machineId=${machine.id}`}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
        Ask Agent
      </button>
      <p className="text-gray-500 text-xs mt-3">Updated {machine.updated}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────── */
/* REUSABLE MODAL WRAPPER */
/* ─────────────────────────────────────────────── */

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        aria-label="Close modal"
      >
        <X />
      </button>
      {children}
    </div>
  </div>
);

/* ─────────────────────────────────────────────── */
/* REUSABLE INPUT FORM FOR ADD + EDIT */
/* ─────────────────────────────────────────────── */

type MachineFormProps = {
  machine: Partial<Machine> | Machine | null | undefined;
  setMachine: (upd: Partial<Machine>) => void;
};

const MachineForm: React.FC<MachineFormProps> = ({ machine, setMachine }) => (
  <>
    <input
      type="text"
      placeholder="Machine Name"
      className="w-full p-3 border rounded-xl mb-3"
      value={machine?.name ?? ""}
      onChange={(e) => setMachine({ name: e.target.value })}
    />

    <input
      type="text"
      placeholder="Machine Type"
      className="w-full p-3 border rounded-xl mb-3"
      value={machine?.type ?? ""}
      onChange={(e) => setMachine({ type: e.target.value })}
    />

    <input
      type="text"
      placeholder="Endpoint / Model Path"
      className="w-full p-3 border rounded-xl mb-3"
      value={machine?.endpoint ?? ""}
      onChange={(e) => setMachine({ endpoint: e.target.value })}
    />

    <textarea
      placeholder="Description"
      className="w-full p-3 border rounded-xl mb-4 h-24"
      value={machine?.description ?? ""}
      onChange={(e) => setMachine({ description: e.target.value })}
    />
  </>
);

export default MachinePage;
