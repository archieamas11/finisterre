import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost/finisterre_backend/",
  baseURL: "https://finisterre.x10.bz/",
});
