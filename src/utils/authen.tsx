import { jwtDecode } from "jwt-decode";

export const getRole = (): string | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ role: string }>(token);
    return decoded.role;
  } catch {
    return null;
  }
};