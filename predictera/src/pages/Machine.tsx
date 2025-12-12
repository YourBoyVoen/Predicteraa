import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Menu } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";

type Diagnostic = {
  id: number;
  machine_id: number;
  timestamp: string;
  risk_score: number;
  failure_prediction: any; // JSONB
  failure_type_probabilities: any; // JSONB
  most_likely_failure?: string;
  recommended_action?: string;
  feature_contributions: any; // JSONB
};

type Machine = {
  id: number;
  name: string;
  type: string;
  description?: string;
  created_at: string;
  diagnostics?: Diagnostic[];
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
      id: 1,
      name: "Main Machine",
      type: "L",
      description: "Main machine in the building",
      created_at: "2025-12-12T10:00:00Z",
      diagnostics: [
        {
          id: 1,
          machine_id: 1,
          timestamp: "2025-12-12T10:30:00Z",
          risk_score: 0.2,
          failure_prediction: { predicted: false },
          failure_type_probabilities: { "Normal": 0.8, "Failure A": 0.2 },
          most_likely_failure: "Normal",
          recommended_action: "Continue monitoring",
          feature_contributions: { feature1: 0.1, feature2: 0.05 },
        },
      ],
    },
    {
      id: 2,
      name: "Backup Machine",
      type: "M",
      description: "Backup machine in the building",
      created_at: "2025-12-12T09:00:00Z",
      diagnostics: [
        {
          id: 2,
          machine_id: 2,
          timestamp: "2025-12-12T09:45:00Z",
          risk_score: 0.8,
          failure_prediction: { predicted: true },
          failure_type_probabilities: { "Normal": 0.2, "Failure B": 0.8 },
          most_likely_failure: "Failure B",
          recommended_action: "Schedule maintenance",
          feature_contributions: { feature3: 0.3, feature4: 0.2 },
        },
      ],
    },
  ]);

  // Add Machine Form
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: "",
    type: "",
    description: "",
  });

  /* Add Machine */
  const addMachine = () => {
    if (!newMachine.name || !newMachine.name.trim()) return;

    const created: Machine = {
      id: Date.now(),
      name: newMachine.name!.trim(),
      type: newMachine.type || "Unknown",
      description: newMachine.description || "",
      created_at: new Date().toISOString(),
      diagnostics: [],
    };

    setMachines((prev) => [...prev, created]);

    setShowAddModal(false);
    setNewMachine({ name: "", type: "", description: "" });
  };

  /* Delete Machine */
  const deleteMachine = (id: number) => {
    setMachines((prev) => prev.filter((m) => m.id !== id));
  };

  /* Edit Machine */
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
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10">
        {/* Title */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Machine Settings</h1>
              <p className="text-gray-600">Manage your machines & performance</p>
            </div>
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
            <strong>Description:</strong> {showDetailModal.description}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Created At:</strong> {new Date(showDetailModal.created_at).toLocaleString()}
          </p>
          {showDetailModal.diagnostics && showDetailModal.diagnostics.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-4 mb-2">Latest Diagnostic</h3>
              <p className="text-gray-700 mb-2">
                <strong>Risk Score:</strong> {showDetailModal.diagnostics[0].risk_score.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Most Likely Failure:</strong> {showDetailModal.diagnostics[0].most_likely_failure}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Recommended Action:</strong> {showDetailModal.diagnostics[0].recommended_action}
              </p>
              <p className="text-gray-700">
                <strong>Timestamp:</strong> {new Date(showDetailModal.diagnostics[0].timestamp).toLocaleString()}
              </p>
            </>
          )}
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

/* Machine Card */
type MachineCardProps = {
  machine: Machine;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const MachineCard: React.FC<MachineCardProps> = ({ machine, onDetail, onEdit, onDelete }) => {
  const latestDiagnostic = machine.diagnostics?.[0];
  const riskScore = latestDiagnostic?.risk_score ?? 0;
  const health = riskScore < 0.3 ? "Healthy" : riskScore < 0.7 ? "Warning" : "Critical";
  const performance = Math.round((1 - riskScore) * 100);

  const healthColor =
    health === "Healthy"
      ? "bg-green-100 text-green-700"
      : health === "Warning"
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
        {health}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Performance</span>
          <span className="font-semibold">{performance}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: `${performance}%` }}
          />
        </div>
      </div>

      {latestDiagnostic && (
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Risk Score:</strong> {riskScore.toFixed(2)}</p>
          <p><strong>Most Likely:</strong> {latestDiagnostic.most_likely_failure}</p>
        </div>
      )}
    </div>
  );
};

/* Modal Wrapper */

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

/* Input Form */

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

    <textarea
      placeholder="Description"
      className="w-full p-3 border rounded-xl mb-4 h-24"
      value={machine?.description ?? ""}
      onChange={(e) => setMachine({ description: e.target.value })}
    />
  </>
);

export default MachinePage;
