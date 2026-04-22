import { createContext, useContext, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../utils/auth";

import API from "@/services/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage so sessions survive page reloads
  const [user, setUser] = useState(() => getCurrentUser());

  const login = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const registerCompany = async (formData) => {
    try {
      const { data } = await API.post("/auth/register-company", formData);
      if (data.success) {
        localStorage.setItem("company", JSON.stringify(data.company));
      }
      return data;
    } catch (err) {
      console.log(err.message);
    }
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
    <AuthContext value={{ user, login, register, logout, registerCompany }}>
      {children}
    </AuthContext>
  );
}

export const useAuth = () => useContext(AuthContext);
