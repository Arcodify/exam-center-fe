import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginService } from '@/services/login.service';
import toast from 'react-hot-toast';
import { getUserFromStorage, storeUserData, clearAuthData } from '@/utils/storage';

interface Level {
  name: string;
  id: number;
}

interface Program {
  name: string;
  id: number;
}

interface UserInfo {
  id: number;
  level: Level;
  level_id: number;
  program: Program;
  program_id: number;
  shift_id: number;
  shift_plan_id: number;
  shift_plan_program_id: string;
  name: string;
  email: string;
  phone: string;
  symbol_number: string;
  date_of_birth: string;
  photo: string | null;
  biometric_image: string | null;
  right_thumb_image: string | null;
  left_thumb_image: string | null;
  start_time: string;
  duration: string;
  access_token: string;
}

interface LoginCredentials {
  symbol_number: string;
  password: string;
}

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  formatTime: (seconds: number) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = getUserFromStorage();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        // Clear corrupted data
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await loginService.login(
        credentials.symbol_number,
        credentials.password
      );

      if (response.success) {
        const userData = response.data;
        
        // Store using type-safe utility
        const stored = storeUserData(userData);
        if (!stored) {
          toast.error('Failed to store user data');
          return false;
        }
        
        // Update state
        setUser(userData);
        
        toast.success('Login successful');
        return true;
      } else {
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear using type-safe utility
    clearAuthData();
    
    // Clear state
    setUser(null);
    
    toast.success('Logged out successfully');
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    formatTime,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 