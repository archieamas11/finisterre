// src/api/getApiUrl.ts
import axios from "axios";

export const REMOTE_API_URL = "https://finisterre-backend.onrender.com/";
export const LOCAL_API_URL = "http://localhost/finisterre_backend/";

// Simple runtime check for backend availability (first request will try REMOTE, fallback on error)
export async function getApiUrl(): Promise<string> {
  try {
    await axios.head(REMOTE_API_URL, { timeout: 2000 });
    return REMOTE_API_URL;
  } catch {
    return LOCAL_API_URL;
  }
}
