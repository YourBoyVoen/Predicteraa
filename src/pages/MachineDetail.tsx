import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Activity, X, Menu, Trash2, ChevronRight } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { machinesApi, type Machine } from "../services/machinesApi";
import { sensorsApi, type SensorData } from "../services/sensorsApi";
import { diagnosticsApi, type Diagnostic } from "../services/diagnosticsApi";

const MachineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [machine, setMachine] = useState<Machine | null>(null);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [diagnosticData, setDiagnosticData] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddSensorModal, setShowAddSensorModal] = useState(false);
  const [showDiagnosticsConfirmModal, setShowDiagnosticsConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  // const [showEditMachineModal, setShowEditMachineModal] = useState(false);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);

  // Add Sensor Form
  const [newSensorData, setNewSensorData] = useState({
    airTemp: "",
    processTemp: "",
    rotationalSpeed: "",
    torque: "",
    toolWear: "",
  });

  // Edit Machine Form - HIDDEN FOR NOW
  // const [editMachineData, setEditMachineData] = useState({
  //   name: "",
  //   type: "",
  // });

  // Load data on mount
  useEffect(() => {
    if (id) {
      loadMachineData();
    }
  }, [id]);

  const loadMachineData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Load machine details
      const machineResponse = await machinesApi.getById(id);
      setMachine(machineResponse.data.machine);
      
      // Initialize edit form with current machine data - HIDDEN FOR NOW
      // setEditMachineData({
      //   name: machineResponse.data.machine.name,
      //   type: machineResponse.data.machine.type,
      // });

      // Load sensor history
      const sensorResponse = await sensorsApi.getHistory(id, 20);
      const sortedSensorData = sensorResponse.data.sensorDataHistory
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setSensorData(sortedSensorData);

      // Load diagnostic history
      const diagnosticResponse = await diagnosticsApi.getHistory(id, 20);
      const sortedDiagnosticData = diagnosticResponse.data.diagnostics
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setDiagnosticData(sortedDiagnosticData);

    } catch (err) {
      console.error("Error loading machine data:", err);
      setError("Failed to load machine data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunDiagnostics = async () => {
    setShowDiagnosticsConfirmModal(true);
  };

  const confirmRunDiagnostics = async () => {
    setShowDiagnosticsConfirmModal(false);

    try {
      setRunningDiagnostics(true);
      await diagnosticsApi.runDiagnostics(id);
      // Reload data to show new diagnostic
      await loadMachineData();
    } catch (err) {
      console.error("Error running diagnostics:", err);
      setError("Failed to run diagnostics");
    } finally {
      setRunningDiagnostics(false);
    }
  };

  const handleAddSensorData = async () => {
    if (!id) return;

    try {
      const payload = {
        machineId: parseInt(id),
        airTemp: parseFloat(newSensorData.airTemp),
        processTemp: parseFloat(newSensorData.processTemp),
        rotationalSpeed: parseFloat(newSensorData.rotationalSpeed),
        torque: parseFloat(newSensorData.torque),
        toolWear: parseFloat(newSensorData.toolWear),
      };

      await sensorsApi.create(payload);

      // Reset form
      setNewSensorData({
        airTemp: "",
        processTemp: "",
        rotationalSpeed: "",
        torque: "",
        toolWear: "",
      });
      setShowAddSensorModal(false);

      // Reload sensor data
      const sensorResponse = await sensorsApi.getHistory(id, 20);
      const sortedSensorData = sensorResponse.data.sensorDataHistory
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setSensorData(sortedSensorData);

    } catch (err) {
      console.error("Error adding sensor data:", err);
      setError("Failed to add sensor data");
    }
  };

  const handleDeleteMachine = async () => {
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteMachine = async () => {
    setShowDeleteConfirmModal(false);

    try {
      await machinesApi.delete(id);
      navigate('/machine'); // Redirect to machines list
    } catch (err) {
      console.error("Error deleting machine:", err);
      setError("Failed to delete machine");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading machine details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !machine) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Machine not found"}</p>
            <button
              onClick={() => navigate("/machine")}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Back to Machines
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              className="md:hidden p-2 rounded-lg border"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
              <ChevronRight size={16} />
              <button
                onClick={() => navigate("/machine")}
                className="hover:text-blue-600 transition-colors"
              >
                Machines
              </button>
              <ChevronRight size={16} />
              <span className="text-gray-900 font-medium">{machine.name}</span>
            </nav>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{machine.name}</h1>
              <p className="text-gray-600">Machine Type: {machine.type} | ID: {machine.id}</p>
            </div>

            <div className="flex gap-3">
              {/* <button
                onClick={() => {
                  setEditMachineData({
                    name: machine.name,
                    type: machine.type,
                  });
                  setShowEditMachineModal(true);
                }}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition"
              >
                <Pencil className="w-4 h-4" />
                Edit Machine
              </button> */}
              <button
                onClick={handleDeleteMachine}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete Machine
              </button>
              <button
                onClick={() => setShowAddSensorModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add Sensor Data
              </button>
              <button
                onClick={handleRunDiagnostics}
                disabled={runningDiagnostics}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Activity className="w-4 h-4" />
                {runningDiagnostics ? "Running..." : "Run Diagnostics"}
              </button>
            </div>
          </div>
        </div>

        {/* Content - Vertical Stack */}
        <div className="space-y-8">
          {/* Sensor Data Section */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Sensor Data History
            </h2>

            {sensorData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sensor data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                    <th className="text-left py-2 px-2">Timestamp</th>
                      <th className="text-left py-2 px-2">Air Temp (K)</th>
                      <th className="text-left py-2 px-2">Process Temp (K)</th>
                      <th className="text-left py-2 px-2">Speed (RPM)</th>
                      <th className="text-left py-2 px-2">Torque (Nm)</th>
                      <th className="text-left py-2 px-2">Tool Wear (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensorData.map((sensor) => (
                      <tr key={sensor.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">
                          {new Date(sensor.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2 px-2">{sensor.air_temp}</td>
                        <td className="py-2 px-2">{sensor.process_temp}</td>
                        <td className="py-2 px-2">{sensor.rotational_speed}</td>
                        <td className="py-2 px-2">{sensor.torque}</td>
                        <td className="py-2 px-2">{sensor.tool_wear}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Diagnostic Data Section */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Diagnostic History
            </h2>

            {diagnosticData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No diagnostic data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                    <th className="text-left py-2 px-2">Timestamp</th>
                      <th className="text-left py-2 px-2">Risk Score</th>
                      <th className="text-left py-2 px-2">Will Fail</th>
                      <th className="text-left py-2 px-2">Most Likely Failure</th>
                      <th className="text-left py-2 px-2">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnosticData.map((diagnostic) => (
                      <tr key={diagnostic.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">
                          {new Date(diagnostic.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2 px-2">
                          <span className={`font-medium ${
                            diagnostic.risk_score > 0.7 ? 'text-red-600' :
                            diagnostic.risk_score > 0.3 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {diagnostic.risk_score.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span className={diagnostic.failure_prediction.will_fail ? 'text-red-600' : 'text-green-600'}>
                            {diagnostic.failure_prediction.will_fail ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-2 px-2">{diagnostic.most_likely_failure || 'None'}</td>
                        <td className="py-2 px-2 max-w-xs truncate" title={diagnostic.recommended_action || 'N/A'}>
                          {diagnostic.recommended_action || 'N/A'}
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

      {/* ADD SENSOR DATA MODAL */}
      {showAddSensorModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowAddSensorModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Sensor Data</h2>

            <div className="space-y-3">
              <input
                type="number"
                step="0.1"
                placeholder="Air Temperature (K)"
                className="w-full p-3 border rounded-xl"
                value={newSensorData.airTemp}
                onChange={(e) => setNewSensorData(prev => ({ ...prev, airTemp: e.target.value }))}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Process Temperature (K)"
                className="w-full p-3 border rounded-xl"
                value={newSensorData.processTemp}
                onChange={(e) => setNewSensorData(prev => ({ ...prev, processTemp: e.target.value }))}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rotational Speed (RPM)"
                className="w-full p-3 border rounded-xl"
                value={newSensorData.rotationalSpeed}
                onChange={(e) => setNewSensorData(prev => ({ ...prev, rotationalSpeed: e.target.value }))}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Torque (Nm)"
                className="w-full p-3 border rounded-xl"
                value={newSensorData.torque}
                onChange={(e) => setNewSensorData(prev => ({ ...prev, torque: e.target.value }))}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Tool Wear (min)"
                className="w-full p-3 border rounded-xl"
                value={newSensorData.toolWear}
                onChange={(e) => setNewSensorData(prev => ({ ...prev, toolWear: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-xl border"
                onClick={() => setShowAddSensorModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSensorData}
                className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
              >
                Add Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIAGNOSTICS CONFIRMATION MODAL */}
      {showDiagnosticsConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowDiagnosticsConfirmModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Confirm Diagnostics</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to run diagnostics for this machine? This will analyze the latest sensor data and may take a moment.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl border"
                onClick={() => setShowDiagnosticsConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={confirmRunDiagnostics}
                disabled={runningDiagnostics}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {runningDiagnostics ? "Running..." : "Run Diagnostics"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirmModal && machine && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowDeleteConfirmModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Delete Machine</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>"{machine.name}"</strong>?
            </p>
            <p className="text-red-600 text-sm mb-6">
              This action cannot be undone. All associated sensor data and diagnostics will be permanently removed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl border"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMachine}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Delete Machine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MACHINE MODAL - HIDDEN FOR NOW */}
      {/* {showEditMachineModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowEditMachineModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Machine</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Machine Name"
                className="w-full p-3 border rounded-xl"
                value={editMachineData.name}
                onChange={(e) => setEditMachineData(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Machine Type"
                className="w-full p-3 border rounded-xl"
                value={editMachineData.type}
                onChange={(e) => setEditMachineData(prev => ({ ...prev, type: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-xl border"
                onClick={() => setShowEditMachineModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleEditMachine}
                className="px-4 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MachineDetailPage;