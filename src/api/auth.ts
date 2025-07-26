// src/api/auth.ts
import axios from "axios";

const API_URL = "http://localhost/finisterre_backend/auth/";

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  isAdmin?: boolean;
}

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  try {
    const res = await axios.post<LoginResponse>(API_URL + "login.php", { username, password });
    return res.data;
  } catch (error: any) {
    // Handle network errors or server errors
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data.message || "Server error occurred"
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "Network error. Please check your connection."
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: "An unexpected error occurred"
      };
    }
  }
}

export async function resetPassword(username: string, newPassword: string) {
  const res = await axios.post(API_URL + "reset_password.php", {
    username,
    new_password: newPassword,
  });
  return res.data;
}

export async function forgotPassword(username: string) {
  const res = await axios.post(API_URL + "forgot_password.php", { username });
  return res.data;
}