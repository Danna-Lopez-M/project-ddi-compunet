import { createContext, useContext, useState } from "react";
import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  activateUser,
} from "../api/user";

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserById = async (id) => {
    try {
      setLoading(true);
      const response = await getUserById(id);
      setSelectedUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (id, userData) => {
    try {
      setLoading(true);
      const response = await updateUser(id, userData);
      setSelectedUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    try {
      setLoading(true);
      await deleteUser(id);
      await fetchAllUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error al borrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserActive = async (id) => {
    try {
      setLoading(true);
      await activateUser(id);
      await fetchAllUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al cambiar el estado del usuario",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        selectedUser,
        loading,
        error,
        fetchUserById,
        fetchAllUsers,
        updateUserData,
        removeUser,
        toggleUserActive,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
