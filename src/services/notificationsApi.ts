// Types
export interface NotificationItem {
  id: string;
  machineName: string;
  message: string;
  level: 'warning' | 'critical' | 'info';
  time: string;
}

export interface NotificationsResponse {
  status: string;
  data: {
    notifications: NotificationItem[];
  };
}

// API methods
export const notificationsApi = {
  // GET /notifications - Get notifications
  getNotifications: async (): Promise<NotificationItem[]> => {
    // TODO: Replace with actual backend endpoint when available
    // For now, return mock data
    return [
      {
        id: '1',
        machineName: 'CNC Machine A',
        message: 'High risk score detected',
        level: 'critical',
        time: '2 minutes ago',
      },
      {
        id: '2',
        machineName: 'CNC Machine B',
        message: 'Tool wear approaching limit',
        level: 'warning',
        time: '15 minutes ago',
      },
    ];
  },
};
