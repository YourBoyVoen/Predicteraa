import { httpClient } from './httpClient';

// Types
export interface Machine {
  id: number;
  name: string;
  type: string;
  timestamp: string;
}

export interface MachinesResponse {
  status: string;
  data: {
    machines: Machine[];
  };
}

export interface MachineResponse {
  status: string;
  data: {
    machine: Machine;
  };
}

export interface CreateMachinePayload {
  name: string;
  type: string;
}

export interface CreateMachineResponse {
  status: string;
  message: string;
  data: {
    machineId: number;
  };
}

export interface UpdateMachinePayload {
  name: string;
  type: string;
}

export interface UpdateMachineResponse {
  status: string;
  message: string;
}

export interface DeleteResponse {
  status: string;
  message: string;
}

// API methods
export const machinesApi = {
  // GET /machines - Get all machines
  getAll: async (): Promise<MachinesResponse> => {
    return httpClient.get<MachinesResponse>('/api/machines');
  },

  // GET /machines/{id} - Get machine by ID
  getById: async (id: number | string): Promise<MachineResponse> => {
    return httpClient.get<MachineResponse>(`/api/machines/${id}`);
  },

  // POST /machines - Create a new machine
  create: async (payload: CreateMachinePayload): Promise<CreateMachineResponse> => {
    return httpClient.post<CreateMachineResponse>('/api/machines', payload);
  },

  // PUT /machines/{id} - Update machine by ID
  update: async (id: number | string, payload: UpdateMachinePayload): Promise<UpdateMachineResponse> => {
    return httpClient.put<UpdateMachineResponse>(`/api/machines/${id}`, payload);
  },

  // DELETE /machines/{id} - Delete machine by ID
  delete: async (id: number | string): Promise<DeleteResponse> => {
    return httpClient.delete<DeleteResponse>(`/api/machines/${id}`);
  },
};
