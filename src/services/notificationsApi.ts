// notificationsApi.ts
import { httpClient } from "./httpClient";

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

export interface PostNotificationPayload {
  userId: string;
  machineId?: string;
  level?: string;
  message?: string;
}

export interface PostNotificationResponse {
  status: string;
  message: string;
  data: {
    notificationId: number;
  };
}

// API methods
export const notificationsApi = {
  // POST /notifications - Create a new notification
  addNotification: async (payload: PostNotificationPayload): Promise<PostNotificationResponse> => {
    return httpClient.post<PostNotificationResponse>('/notifications', payload);
  },
  
  // GET /notifications - Get notifications
  getNotifications: async (): Promise<NotificationItem[]> => {
    const response = await httpClient.get<NotificationsResponse>('/notifications');
    return response.data.notifications;
  },
};
