import { httpClient } from './httpClient';

// Types
export interface FailurePrediction {
  will_fail: boolean;
  confidence: number;
}

export interface FailureTypeProbabilities {
  TWF: number;
  HDF: number;
  PWF: number;
  OSF: number;
  RNF: number;
}

export interface FeatureContributions {
  air_temperature: number;
  process_temperature: number;
  rotational_speed: number;
  torque: number;
  tool_wear: number;
}

export interface Diagnostic {
  id: number;
  machine_id: number;
  timestamp: string;
  risk_score: number;
  failure_prediction: FailurePrediction;
  failure_type_probabilities: FailureTypeProbabilities;
  most_likely_failure: string | null;
  recommended_action: string | null;
  feature_contributions?: FeatureContributions;
}

export interface PostDiagnosticResponse {
  status: string;
  message: string;
  data: {
    diagnosticsId: number;
  };
}

export interface LatestDiagnosticResponse {
  status: string;
  data: {
    latestDiagnosticData: Diagnostic;
  };
}

export interface DiagnosticHistoryResponse {
  status: string;
  data: {
    diagnostics: Diagnostic[];
  };
}

export interface BulkDiagnosticResult {
  machineId: string;
  diagnosticsId?: number;
  error?: string;
  success: boolean;
}

export interface BulkDiagnosticsResponse {
  status: string;
  message: string;
  data: {
    successful: BulkDiagnosticResult[];
    failed: BulkDiagnosticResult[];
    total: number;
    successCount: number;
    failureCount: number;
  };
}

// API methods
export const diagnosticsApi = {
  // POST /diagnostics/{machineId} - Run diagnostics for a machine
  runDiagnostics: async (machineId: number | string): Promise<PostDiagnosticResponse> => {
    return httpClient.post<PostDiagnosticResponse>(`/api/diagnostics/${machineId}`);
  },

  // GET /diagnostics/{machineId}/latest - Get latest diagnostic
  getLatest: async (machineId: number | string): Promise<LatestDiagnosticResponse> => {
    return httpClient.get<LatestDiagnosticResponse>(`/api/diagnostics/${machineId}/latest`);
  },

  // GET /diagnostics/{machineId}/history - Get diagnostic history
  getHistory: async (machineId: number | string, limit?: number): Promise<DiagnosticHistoryResponse> => {
    const query = limit ? `?limit=${limit}` : '';
    return httpClient.get<DiagnosticHistoryResponse>(`/api/diagnostics/${machineId}/history${query}`);
  },

  // GET /diagnostics - Get latest diagnostics for all machines
  getAllLatest: async (): Promise<DiagnosticHistoryResponse> => {
    return httpClient.get<DiagnosticHistoryResponse>('/api/diagnostics');
  },

  // POST /diagnostics/bulk - Run diagnostics for all machines
  runBulkDiagnostics: async (): Promise<BulkDiagnosticsResponse> => {
    return httpClient.post<BulkDiagnosticsResponse>('/api/diagnostics/bulk');
  },
};
