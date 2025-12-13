// Types
export interface HistoryItem {
  id: number;
  machineName: string;
  issue: string;
  status: 'completed' | 'in-progress' | 'pending';
  technician: string;
  date: string;
}

export interface HistoryResponse {
  status: string;
  data: {
    history: HistoryItem[];
  };
}

// API methods
export const historyApi = {
  // GET /history - Get maintenance history
  getHistory: async (): Promise<HistoryItem[]> => {
    // TODO: Replace with actual backend endpoint when available
    // For now, return mock data
    return [
      {
        id: 1,
        machineName: 'CNC Machine A',
        issue: 'Tool wear detected',
        status: 'completed',
        technician: 'John Doe',
        date: '2024-01-15',
      },
      {
        id: 2,
        machineName: 'CNC Machine B',
        issue: 'High temperature alert',
        status: 'in-progress',
        technician: 'Jane Smith',
        date: '2024-01-16',
      },
    ];
  },
};
