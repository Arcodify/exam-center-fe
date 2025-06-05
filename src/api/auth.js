import axios from "axios";
import api from "./api";

export const handleLoginpro = async (email, password) => {
  try {
    const response = await api.post(`/login/student/`, {
      symbol_number,
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
