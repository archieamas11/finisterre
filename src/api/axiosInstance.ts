import axios from "axios";

export const api = axios.create({
  baseURL: "https://finisterre.x10.bz/",
});
