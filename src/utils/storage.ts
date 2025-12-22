// Type-safe localStorage utilities

interface StoredUserData {
  id: number;
  level: {
    name: string;
    id: number;
  };
  level_id: number;
  program: {
    name: string;
    id: number;
  };
  subject: {
    name: string;
    id: number;
  };
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

/**
 * Type-safe function to get user data from localStorage
 * @returns User data or null if not found/invalid
 */
export const getUserFromStorage = (): StoredUserData | null => {
  try {
    const storedUser = localStorage.getItem("userInfo");
    if (!storedUser) {
      return null;
    }

    const userData = JSON.parse(storedUser) as StoredUserData;

    // Validate required fields
    if (!userData.access_token || !userData.id || !userData.name) {
      console.warn("Invalid user data in localStorage");
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

/**
 * Type-safe function to get access token from localStorage
 * @returns Access token or null if not found
 */
export const getAccessTokenFromStorage = (): string | null => {
  try {
    // First try to get from userInfo
    const userData = getUserFromStorage();
    if (userData?.access_token) {
      return userData.access_token;
    }

    // Fallback to direct token access
    const token = localStorage.getItem("accessToken");
    return token;
  } catch (error) {
    console.error("Error getting access token from localStorage:", error);
    return null;
  }
};

/**
 * Type-safe function to check if user is authenticated
 * @returns true if user data and token exist
 */
export const isUserAuthenticated = (): boolean => {
  const userData = getUserFromStorage();
  const token = getAccessTokenFromStorage();

  return !!(userData && token);
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("accessToken");
};

/**
 * Store user data in localStorage with validation
 * @param userData - User data to store
 * @returns true if stored successfully
 */
export const storeUserData = (userData: StoredUserData): boolean => {
  try {
    if (!userData.access_token || !userData.id) {
      console.error("Invalid user data provided");
      return false;
    }

    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("accessToken", userData.access_token);
    return true;
  } catch (error) {
    console.error("Error storing user data:", error);
    return false;
  }
};
