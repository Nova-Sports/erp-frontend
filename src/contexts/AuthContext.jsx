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

  const login = (email, password) => {
    const result = loginUser(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const register = (data) => {
    const result = registerUser(data);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
