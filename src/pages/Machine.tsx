import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Menu } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";

type Diagnostic = {
  id: number;
  machine_id: number;
  timestamp: string;
  risk_score: number;
  failure_prediction: { predicted: boolean };
  failure_type_probabilities: Record<string, number>;
  most_likely_failure?: string;
  recommended_action?: string;
  feature_contributions: Record<string, number>;
};
type SensorData = {
  id: number;
  machine_id: number;
  timestamp: string;
  data: Record<string, number | string>;
};

type Machine = {
  id: number;
  name: string;
  type: string;
  timestamp: string;
  diagnostics?: Diagnostic[];
  sensors?: SensorData[];
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
      timestamp: "2025-12-12T10:00:00Z",
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
      sensors: [
        {
          id: 1,
          machine_id: 1,
          timestamp: "2025-12-12T10:10:00Z",
          data: { temperature: 70, vibration: 0.02 },
        },
      ],
    },
    {
      id: 2,
      name: "Backup Machine",
      type: "M",
      timestamp: "2025-12-12T09:00:00Z",
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
      sensors: [
        {
          id: 2,
          machine_id: 2,
          timestamp: "2025-12-12T09:30:00Z",
          data: { temperature: 80, vibration: 0.05 },
        },
      ],
    },
    {
      id: 3,
      name: "New Machine",
      type: "H",
      timestamp: "2025-12-12T11:00:00Z",
      diagnostics: [],
      sensors: [],
    },
  ]);
  // Sensor Data Modal States
  const [showSensorModal, setShowSensorModal] = useState<Machine | null>(null);
  const [showAddSensorModal, setShowAddSensorModal] = useState<Machine | null>(null);

  // Manual Diagnostic Modal
  const [showManualDiagModal, setShowManualDiagModal] = useState<Machine | null>(null);
  const [manualDiagForm, setManualDiagForm] = useState<{ [key: string]: string | number }>({ risk_score: 0, most_likely_failure: '', recommended_action: '' });

  // Add Machine Form
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: "",
    type: "",
  });

  /* Add Machine */
  const addMachine = () => {
    if (!newMachine.name || !newMachine.name.trim()) return;

    const created: Machine = {
      id: Date.now(),
      name: newMachine.name!.trim(),
      type: newMachine.type || "Unknown",
      timestamp: new Date().toISOString(),
      diagnostics: [],
    };

    setMachines((prev) => [...prev, created]);

    setShowAddModal(false);
    setNewMachine({ name: "", type: "" });
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
              onViewSensors={() => setShowSensorModal(m)}
              onAddSensor={() => setShowAddSensorModal(m)}
              onManualDiagnostic={() => setShowManualDiagModal(m)}
            />
          ))}
              {/* SENSOR DATA MODAL */}
              {showSensorModal && (
                <ModalWrapper onClose={() => setShowSensorModal(null)}>
                  <h2 className="text-xl font-bold mb-4">Sensor Data - {showSensorModal.name}</h2>
                  {showSensorModal.sensors && showSensorModal.sensors.length > 0 ? (
                    <div className="overflow-x-auto max-h-64">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr>
                            <th className="px-2 py-1 border">Timestamp</th>
                            <th className="px-2 py-1 border">air_temp</th>
                            <th className="px-2 py-1 border">process_temp</th>
                            <th className="px-2 py-1 border">rotational_speed</th>
                            <th className="px-2 py-1 border">torque</th>
                            <th className="px-2 py-1 border">tool_wear</th>
                          </tr>
                        </thead>
                        <tbody>
                          {showSensorModal.sensors.map((s) => (
                            <tr key={s.id}>
                              <td className="px-2 py-1 border">{new Date(s.timestamp).toLocaleString()}</td>
                              <td className="px-2 py-1 border">{s.data.air_temp}</td>
                              <td className="px-2 py-1 border">{s.data.process_temp}</td>
                              <td className="px-2 py-1 border">{s.data.rotational_speed}</td>
                              <td className="px-2 py-1 border">{s.data.torque}</td>
                              <td className="px-2 py-1 border">{s.data.tool_wear}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No sensor data available.</p>
                  )}
                </ModalWrapper>
              )}

              {/* ADD SENSOR DATA MODAL */}
              {showAddSensorModal && (
                <ModalWrapper onClose={() => { setShowAddSensorModal(null); }}>
                  <h2 className="text-xl font-bold mb-4">Add Sensor Data - {showAddSensorModal.name}</h2>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (!showAddSensorModal) return;
                      const timestamp = new Date().toISOString();
                      const machineId = showAddSensorModal.id;
                      // Generate random sensor values
                      const sensorPayload = {
                        machine_id: machineId,
                        air_temp: 298.0 + (Math.random() * 4 - 2), // 296-300K
                        process_temp: 308.0 + (Math.random() * 6 - 3), // 305-311K
                        rotational_speed: 1500 + Math.floor(Math.random() * 100), // 1500-1600 RPM
                        torque: 40.0 + (Math.random() * 10 - 5), // 35-45 Nm
                        tool_wear: Math.floor(Math.random() * 200), // 0-200 minutes
                        timestamp: timestamp
                      };
                      // Optionally: send to endpoint here (async/await fetch)
                      // await fetch('/api/sensor', { method: 'POST', body: JSON.stringify(sensorPayload), headers: { 'Content-Type': 'application/json' } });
                      // Add to local state for demo
                      const newSensor: SensorData = {
                        id: Date.now(),
                        machine_id: machineId,
                        timestamp,
                        data: { ...sensorPayload },
                      };
                      setMachines(prev => prev.map(m =>
                        m.id === machineId
                          ? { ...m, sensors: [...(m.sensors || []), newSensor] }
                          : m
                      ));
                      setShowAddSensorModal(null);
                    }}
                  >
                    <div className="mb-3 text-gray-600 text-sm">
                      Data sensor akan di-generate otomatis dan dikirim ke endpoint.
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        className="px-4 py-2 rounded-xl border"
                        type="button"
                        onClick={() => { setShowAddSensorModal(null); }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Add Sensor Data
                      </button>
                    </div>
                  </form>
                </ModalWrapper>
              )}

              {/* MANUAL DIAGNOSTIC MODAL */}
              {showManualDiagModal && (
                <ModalWrapper onClose={() => { setShowManualDiagModal(null); setManualDiagForm({ risk_score: 0, most_likely_failure: '', recommended_action: '' }); }}>
                  <h2 className="text-xl font-bold mb-4">Manual Diagnostic - {showManualDiagModal.name}</h2>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (!showManualDiagModal) return;
                      const newDiag: Diagnostic = {
                        id: Date.now(),
                        machine_id: showManualDiagModal.id,
                        timestamp: new Date().toISOString(),
                        risk_score: Number(manualDiagForm.risk_score),
                        failure_prediction: { predicted: Number(manualDiagForm.risk_score) > 0.5 },
                        failure_type_probabilities: { [manualDiagForm.most_likely_failure as string]: 1 },
                        most_likely_failure: manualDiagForm.most_likely_failure as string,
                        recommended_action: manualDiagForm.recommended_action as string,
                        feature_contributions: {},
                      };
                      setMachines(prev => prev.map(m =>
                        m.id === showManualDiagModal.id
                          ? { ...m, diagnostics: [newDiag, ...(m.diagnostics || [])] }
                          : m
                      ));
                      setShowManualDiagModal(null);
                      setManualDiagForm({ risk_score: 0, most_likely_failure: '', recommended_action: '' });
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      placeholder="Risk Score (0-1)"
                      className="w-full p-3 border rounded-xl mb-3"
                      value={manualDiagForm.risk_score}
                      onChange={e => setManualDiagForm(f => ({ ...f, risk_score: e.target.value }))}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Most Likely Failure"
                      className="w-full p-3 border rounded-xl mb-3"
                      value={manualDiagForm.most_likely_failure}
                      onChange={e => setManualDiagForm(f => ({ ...f, most_likely_failure: e.target.value }))}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Recommended Action"
                      className="w-full p-3 border rounded-xl mb-3"
                      value={manualDiagForm.recommended_action}
                      onChange={e => setManualDiagForm(f => ({ ...f, recommended_action: e.target.value }))}
                      required
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        className="px-4 py-2 rounded-xl border"
                        type="button"
                        onClick={() => { setShowManualDiagModal(null); setManualDiagForm({ risk_score: 0, most_likely_failure: '', recommended_action: '' }); }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Add Diagnostic
                      </button>
                    </div>
                  </form>
                </ModalWrapper>
              )}
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
            <strong>Timestamp:</strong> {new Date(showDetailModal.timestamp).toLocaleString()}
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
  onViewSensors: () => void;
  onAddSensor: () => void;
  onManualDiagnostic: () => void;
};

const MachineCard: React.FC<MachineCardProps> = ({ machine, onDetail, onEdit, onDelete, onViewSensors, onAddSensor, onManualDiagnostic }) => {
  const latestDiagnostic = machine.diagnostics?.[0];
  const hasDiagnostics = !!latestDiagnostic;
  
  const riskScore = latestDiagnostic?.risk_score ?? 0;
  const health = hasDiagnostics 
    ? (riskScore < 0.3 ? "Healthy" : riskScore < 0.7 ? "Warning" : "Critical")
    : "No Data";
  const performance = hasDiagnostics ? Math.round((1 - riskScore) * 100) : null;

  const healthColor =
    health === "Healthy"
      ? "bg-green-100 text-green-700"
      : health === "Warning"
      ? "bg-yellow-100 text-yellow-700"
      : health === "Critical"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

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
          <button onClick={onViewSensors} aria-label={`View Sensors ${machine.name}`} title="View Sensor Data">
            <span className="w-5 h-5 text-green-600 hover:text-green-800">🔍</span>
          </button>
          <button onClick={onAddSensor} aria-label={`Add Sensor Data ${machine.name}`} title="Add Sensor Data">
            <span className="w-5 h-5 text-blue-600 hover:text-blue-800">➕</span>
          </button>
          <button onClick={onManualDiagnostic} aria-label={`Manual Diagnostic ${machine.name}`} title="Manual Diagnostic">
            <span className="w-5 h-5 text-yellow-600 hover:text-yellow-800">🩺</span>
          </button>
        </div>
      </div>

      <div className={`inline-block px-3 py-1 text-sm rounded-full mt-3 ${healthColor}`}>
        {health}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Performance</span>
          <span className="font-semibold">
            {performance !== null ? `${performance}%` : "N/A"}
          </span>
        </div>
        {performance !== null ? (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${performance}%` }}
            />
          </div>
        ) : (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 bg-gray-400 rounded-full w-full" />
          </div>
        )}
      </div>

      {hasDiagnostics ? (
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Risk Score:</strong> {riskScore.toFixed(2)}</p>
          <p><strong>Most Likely:</strong> {latestDiagnostic.most_likely_failure}</p>
        </div>
      ) : (
        <div className="mt-4 text-sm text-gray-500">
          <p><em>No diagnostic data available</em></p>
          <p><em>Add sensor data to get predictions</em></p>
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
      className="w-full p-3 border rounded-xl mb-4"
      value={machine?.type ?? ""}
      onChange={(e) => setMachine({ type: e.target.value })}
    />
  </>
);

export default MachinePage;
