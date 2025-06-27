import { axiosPublic } from "./axios";

class LoginService {
  async login(symbol_number: string, password: string) {
    try {
      const response = await axiosPublic.post("/login/student/", {
        symbol_number,
        password,
      });
      return {
        success: true,
        data: response.data.data,
        message: "Login successful",
      };
    } catch (error: any) {
      console.log(error.response.data.message);
      return {
        success: false,
        data: null,
        message: error.response.data.message || "Login failed",
      };
    }
  }
}

export const loginService = new LoginService();
