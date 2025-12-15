import { httpClient } from './httpClient';

// Types
export interface User {
  id: number;
  username: string;
  fullname: string;
  role: string;
}

export interface UsersResponse {
  status: string;
  data: {
    users: User[];
  };
}

export interface RegisterUserPayload {
  username: string;
  password: string;
  fullname: string;
  role: string;
}

export interface RegisterUserResponse {
  status: string;
  message: string;
  data: {
    userId: number;
  };
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}

export interface DeleteResponse {
  status: string;
  message: string;
}

// API methods
export const usersApi = {
  // GET /users - Get all users
  getAll: async (): Promise<UsersResponse> => {
    return httpClient.get<UsersResponse>('/api/users');
  },

  // POST /users - Register a new user
  register: async (payload: RegisterUserPayload): Promise<RegisterUserResponse> => {
    return httpClient.post<RegisterUserResponse>('/api/users', payload);
  },

  // GET /users/{id} - Get user by ID
  getById: async (id: number | string): Promise<UserResponse> => {
    return httpClient.get<UserResponse>(`/api/users/${id}`);
  },

  // DELETE /users/{id} - Delete user by ID
  delete: async (id: number | string): Promise<DeleteResponse> => {
    return httpClient.delete<DeleteResponse>(`/api/users/${id}`);
  },
};
