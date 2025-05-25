// types/auth.types.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

export type LoginError = ApiError;

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: UserData) => void;
  clearAuth: () => void;
}
