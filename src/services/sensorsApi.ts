import { httpClient } from './httpClient';

// Types
export interface SensorData {
  id: number;
  machine_id: number;
  air_temp: number;
  process_temp: number;
  rotational_speed: number;
  torque: number;
  tool_wear: number;
  timestamp: string;
}

export interface PostSensorDataPayload {
  machineId: number;
  airTemp: number;
  processTemp: number;
  rotationalSpeed: number;
  torque: number;
  toolWear: number;
}

export interface PostSensorDataResponse {
  status: string;
  message: string;
  data: {
    sensorDataId: number;
  };
}

export interface SensorDataHistoryResponse {
  status: string;
  data: {
    sensorDataHistory: SensorData[];
  };
}

export interface LatestSensorDataResponse {
  status: string;
  data: {
    latestSensorData: SensorData;
  };
}

// API methods
export const sensorsApi = {
  // POST /sensors - Add sensor data
  create: async (payload: PostSensorDataPayload): Promise<PostSensorDataResponse> => {
    return httpClient.post<PostSensorDataResponse>('/api/sensors', payload);
  },

  // GET /sensors/{machineId}/history - Get sensor data history
  getHistory: async (machineId: number | string, limit?: number): Promise<SensorDataHistoryResponse> => {
    const query = limit ? `?limit=${limit}` : '';
    return httpClient.get<SensorDataHistoryResponse>(`/api/sensors/${machineId}/history${query}`);
  },

  // GET /sensors/{machineId}/latest - Get latest sensor data
  getLatest: async (machineId: number | string): Promise<LatestSensorDataResponse> => {
    return httpClient.get<LatestSensorDataResponse>(`/api/sensors/${machineId}/latest`);
  },
};
