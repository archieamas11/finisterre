export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const isAdmin = (): boolean => {
  return localStorage.getItem("isAdmin") === "1";
};

export const logout = (): void => {
  // Clear all authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("isAdmin");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
