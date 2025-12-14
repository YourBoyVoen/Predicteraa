import React, { useState, useEffect } from "react";
import { Plus, X, Menu, ChevronRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { diagnosticsApi } from "../services/diagnosticsApi";
import { useSnackbar } from "../contexts/SnackbarContext";
import { machinesApi } from "../services/machinesApi";

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
  timestamp: string;
  latestDiagnostic?: Diagnostic | null;
};

type ModalWrapperProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const MachinePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);

  // Loading states
  const [bulkLoading, setBulkLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dummy data
  const [machines, setMachines] = useState<Machine[]>([]);

  // Fetch machines and their latest diagnostics
  const fetchMachines = async () => {
    setLoading(true);
    try {
      const machinesResponse = await machinesApi.getAll();
      const diagnosticsResponse = await diagnosticsApi.getAllLatest();
      
      // Create a map of machine_id -> latest diagnostic
      const diagnosticsMap = new Map<number, Diagnostic>();
      diagnosticsResponse.data.diagnostics.forEach((diag) => {
        diagnosticsMap.set(diag.machine_id, diag);
      });
      
      // Combine machines with their diagnostics
      const machinesWithDiagnostics = machinesResponse.data.machines.map((machine) => ({
        ...machine,
        latestDiagnostic: diagnosticsMap.get(machine.id) || null,
      }));
      
      setMachines(machinesWithDiagnostics);
    } catch (error) {
      console.error('Failed to fetch machines:', error);
      showSnackbar('Failed to load machines', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // Add Machine Form
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: "",
    type: "",
  });

  /* Add Machine */
  const addMachine = async () => {
    if (!newMachine.name || !newMachine.name.trim()) return;

    try {
      await machinesApi.create({
        name: newMachine.name.trim(),
        type: newMachine.type || "Unknown",
      });

      showSnackbar('Machine added successfully', 'success');
      setShowAddModal(false);
      setNewMachine({ name: "", type: "" });
      
      // Refresh the list
      fetchMachines();
    } catch (error) {
      console.error('Failed to add machine:', error);
      showSnackbar('Failed to add machine', 'error');
    }
  };

  /* Bulk Run Diagnostics */
  const runBulkDiagnostics = async () => {
    setBulkLoading(true);
    try {
      const response = await diagnosticsApi.runBulkDiagnostics();
      console.log('Bulk diagnostics result:', response);
      
      // Show detailed results
      if (response.data.successCount > 0) {
        showSnackbar(
          `Bulk diagnostics completed: ${response.data.successCount} succeeded, ${response.data.failureCount} failed`,
          response.data.failureCount === 0 ? 'success' : 'warning'
        );
      } else {
        showSnackbar('All bulk diagnostics failed. Check if machines have sensor data.', 'error');
      }
      
      // Log failures for debugging
      if (response.data.failed.length > 0) {
        console.warn('Failed diagnostics:', response.data.failed);
      }
      
      // Refresh machines to show updated diagnostics
      await fetchMachines();
      
    } catch (error) {
      console.error('Bulk diagnostics failed:', error);
      showSnackbar('Failed to run bulk diagnostics. Please try again.', 'error');
    } finally {
      setBulkLoading(false);
    }
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
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </button>
                <ChevronRight size={16} />
                <span className="text-gray-900 font-medium">Machines</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-800">Machine Settings</h1>
              <p className="text-gray-600">Manage your machines & performance</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={runBulkDiagnostics}
              disabled={bulkLoading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              {bulkLoading ? 'Running...' : 'Run Bulk Diagnostics'}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow"
            >
              <Plus className="w-4 h-4" />
              Add Machine
            </button>
          </div>
        </div>

        {/* Machine List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-500">Loading machines...</p>
            </div>
          ) : machines.length === 0 ? (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-500">No machines found. Add your first machine!</p>
            </div>
          ) : (
            machines.map((m) => (
              <MachineCard
                key={m.id}
                machine={m}
                onDetail={() => navigate(`/machine/${m.id}`)}
              />
            ))
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
    </div>
  );
};

/* Machine Card */
type MachineCardProps = {
  machine: Machine;
  onDetail: () => void;
};

const MachineCard: React.FC<MachineCardProps> = ({ machine, onDetail }) => {
  const latestDiagnostic = machine.latestDiagnostic;
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
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition cursor-pointer" onClick={onDetail}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold">
          {machine.name}
        </h3>
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
          <p><strong>Most Likely:</strong> {latestDiagnostic.most_likely_failure || "No Failure"}</p>
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
