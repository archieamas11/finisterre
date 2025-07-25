import axios from "axios";

const API_URL = "http://localhost/finisterre_backend/auth/";

export async function loginUser(username: string, password: string) {
  const res = await axios.post(API_URL + "login.php", { username, password });
  return res.data;
}

export async function resetPassword(username: string, newPassword: string) {
  const res = await axios.post(API_URL + "reset_password.php", { username, new_password: newPassword });
  return res.data;
}

export async function forgotPassword(username: string) {
  const res = await axios.post(API_URL + "forgot_password.php", { username });
  return res.data;
}

