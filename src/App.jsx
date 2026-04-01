import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AnimationProvider } from "./contexts/AnimationContext";
import { VersionProvider } from "./contexts/VersionContext";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Dashboard from "./components/dashboard/Dashboard";
import Password from "./components/modules/Password";
import NotFound from "./components/NotFound";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="password" replace />} />
        <Route path="password" element={<Password />} />
        {/* Catch-all inside dashboard — stays in shell, shows 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* Outer catch-all: redirect to login if not authenticated, landing if authenticated */}
      <Route path="*" element={<RootFallback />} />
    </Routes>
  );
}

function RootFallback() {
  const { user } = useAuth();
  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/" replace />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <VersionProvider>
        <AnimationProvider>
          <NotificationProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </NotificationProvider>
        </AnimationProvider>
      </VersionProvider>
    </BrowserRouter>
  );
}
