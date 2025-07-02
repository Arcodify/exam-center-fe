import { useState, useCallback } from "react";

import { loginService } from "@/services/login.service";
import toast from "react-hot-toast";

interface LoginCredentials {
  symbol_number: string;
  password: string;
}
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

export const useUser = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginService.login(
        credentials.symbol_number,
        credentials.password
      );
      

      if (response.success) {
        // Store user data and token in localStorage
        const userData = response.data;
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("accessToken", userData.access_token);

        // Update state
        setUserInfo(userData);

        toast.success("Login successful");
        return response;
      } else {
        setError(response.message);
        toast.error(response.message);
        return response;
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        data: null,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");

    // Clear state
    setUserInfo(null);
    setError(null);
  }, []);

  // Load user data from localStorage on app start
  const loadUserFromStorage = useCallback(() => {
    try {
     
      const storedUserInfo = localStorage.getItem("userInfo");
      const storedToken = localStorage.getItem("accessToken");

     

      if (storedUserInfo && storedToken) {
        const userData = JSON.parse(storedUserInfo);
       
        setUserInfo(userData);
        return true;
      }
     
      return false;
    } catch (error) {
     
      return false;
    }
  }, []);

  // Getter functions
  const getAccessToken = useCallback(() => {
    const token =
      localStorage.getItem("accessToken") || userInfo?.access_token || null;
   
    return token;
  }, [userInfo]);

  const isAuthenticated = useCallback(() => {
    const token = getAccessToken();
    const hasUser = !!userInfo;
    const authenticated = !!token && hasUser;
   
    return authenticated;
  }, [getAccessToken, userInfo]);

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    // State
    userInfo,
    isLoading,
    error,

    // Actions
    login,
    logout,
    loadUserFromStorage,

    // Getters
    getAccessToken,
    isAuthenticated,
    formatTime,
  };
};
