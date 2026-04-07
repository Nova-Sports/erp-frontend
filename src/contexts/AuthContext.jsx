import { createContext, useContext, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise from localStorage so sessions survive page reloads
  const [user, setUser] = useState(() => getCurrentUser());

  const login = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const register = async (data) => {
    const result = await registerUser(data);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext value={{ user, login, register, logout }}>
      {children}
    </AuthContext>
  );
}

export const useAuth = () => useContext(AuthContext);
