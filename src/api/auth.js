import axios from "axios";

const DEV_BACKEND_URL = import.meta.env.VITE_DEV_BACKEND_URL;
const PROD_BACKEND_URL = import.meta.env.VITE_PROD_BACKEND_URL;

const APP_URI =
  import.meta.env.MODE === "development"
    ? DEV_BACKEND_URL
    : PROD_BACKEND_URL || DEV_BACKEND_URL;

export const handleLoginpro = async (email, password) => {
  console.log("APP_URI:", APP_URI); // for debugging
  try {
    const response = await axios.post(`${APP_URI}/auth/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Login error:", error);

    if (error.response) {
      return {
        type: "ERROR",
        message:
          error.response.data?.message || "An error occurred during login",
      };
    } else if (error.request) {
      return {
        type: "ERROR",
        message: "No response from the server. Please try again later.",
      };
    } else {
      return {
        type: "ERROR",
        message: "An unexpected error occurred. Please try again.",
      };
    }
  }
};
