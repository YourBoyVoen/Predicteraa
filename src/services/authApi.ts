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
  // POST /authentications - User login
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>('/authentications', payload);
  },

  // PUT /authentications - Refresh access token
  refreshToken: async (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> => {
    return httpClient.put<RefreshTokenResponse>('/authentications', payload);
  },

  // DELETE /authentications - User logout
  logout: async (payload: LogoutPayload): Promise<LogoutResponse> => {
    return httpClient.delete<LogoutResponse>('/authentications', {
      body: JSON.stringify(payload),
    });
  },
};
