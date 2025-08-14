import { api } from "./axiosInstance";

export interface LoginResponse {
  token?: string;
  message: string;
  success: boolean;
  isAdmin?: boolean;
}

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>("auth/login.php", {
      username,
      password,
    });
    return res.data;
  } catch (error: any) {
    // Handle network errors or server errors
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data.message || "Server error occurred",
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  }
}

export async function resetPassword(username: string, newPassword: string) {
  const res = await api.post("auth/reset_password.php", {
    username,
    new_password: newPassword,
  });
  return res.data;
}

export async function forgotPassword(username: string) {
  const res = await api.post("auth/forgot_password.php", {
    username,
  });
  return res.data;
}
