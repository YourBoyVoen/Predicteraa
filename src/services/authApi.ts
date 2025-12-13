import { httpClient } from './httpClient';

// Types
export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface LogoutResponse {
  status: string;
  message: string;
}

// API methods
export const authApi = {
  // POST /auth/login - User login
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>('/auth/login', payload);
  },

  // POST /auth/refresh - Refresh access token
  refreshToken: async (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> => {
    return httpClient.post<RefreshTokenResponse>('/auth/refresh', payload);
  },

  // POST /auth/logout - User logout
  logout: async (payload: LogoutPayload): Promise<LogoutResponse> => {
    return httpClient.post<LogoutResponse>('/auth/logout', payload);
  },
};
