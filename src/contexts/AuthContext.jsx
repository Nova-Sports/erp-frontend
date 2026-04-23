import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../utils/auth";

import API from "@/services/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage so sessions survive page reloads
  const [user, setUser] = useState(() => getCurrentUser());

  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });

      if (data.success && data.employee && data.token) {
        setUser({ ...data.employee, token: data.token });
        loginUser({ ...data.employee, token: data.token }); // Persist to localStorage
        return { success: true };
      } else {
        return { error: data.error || "Login failed." };
      }
    } catch (err) {
      console.log(err.message);
      return { error: err.response?.data?.error || "Login failed." };
    }
  };

  const registerCompany = async (formData) => {
    try {
      const { data } = await API.post("/auth/register-company", formData);
      if (data.success) {
        localStorage.setItem("company", JSON.stringify(data.company));
        return data;
      } else {
        return { error: data.error || "Company registration failed." };
      }
    } catch (err) {
      console.log(err.message);
      return {
        error: err.response?.data?.error || "Company registration failed.",
      };
    }
  };

  const registerUser = async (formData) => {
    try {
      const { data } = await API.post("/auth/register-user", formData);
      if (data.success && data.employee && data.token) {
        loginUser({ ...data.employee, token: data.token }); // Persist to localStorage
        setUser({ ...data.employee, token: data.token });
        return { success: true };
      } else {
        return { error: data.error || "User registration failed." };
      }
    } catch (err) {
      console.log(err.message);
      return {
        error: err.response?.data?.message || "User registration failed.",
      };
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, registerUser, logout, registerCompany }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
