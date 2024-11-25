import { createContext, useContext, useEffect, useState } from "react";
import {
  registerRequest,
  loginRequest,
  logoutRequest,
  verifyTokenRequest,
} from "../api/auth";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasRole = (requiredRoles) => {
    if (!user || !user.roles) return false;
    return requiredRoles.some((role) =>
      user.roles.some(
        (userRole) => userRole.toUpperCase() === role.toUpperCase(),
      ),
    );
  };

  const processToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
      return decoded;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const signup = async (user) => {
    try {
      await registerRequest(user);
      return true;
    } catch (error) {
      setErrors(
        error.response?.data?.message || ["Error al registrar usuario"],
      );
      return false;
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        const decodedUser = processToken(res.data.token);
        if (decodedUser) {
          setErrors([]);
        }
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message
          ? [error.response.data.message]
          : ["Error al iniciar sesión"],
      );
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        await verifyTokenRequest();
        processToken(token);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        user,
        isAuthenticated,
        errors,
        loading,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
