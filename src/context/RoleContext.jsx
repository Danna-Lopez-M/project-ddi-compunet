import { createContext, useContext, useState } from "react";
import {
  getAllRoles,
  createRole,
  //assignRoleToUser,
  deleteRole,
  updateRole,
} from "../api/role";

export const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole debe ser usado dentro de un RoleProvider");
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllRoles = async () => {
    try {
      setLoading(true);
      const response = await getAllRoles();
      setRoles(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener roles");
    } finally {
      setLoading(false);
    }
  };

  const createNewRole = async (role) => {
    try {
      setLoading(true);
      await createRole(role);
      await fetchAllRoles();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el rol");
    } finally {
      setLoading(false);
    }
  };

  const updateRoleData = async (roleId, roleData) => {
    try {
      setLoading(true);
      await updateRole(roleId, roleData);
      await fetchAllRoles();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el rol");
    } finally {
      setLoading(false);
    }
  };

  // const assignRole = async (userId, roleId) => {
  //   try {
  //     setLoading(true);
  //     await assignRoleToUser(userId, roleId);
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Error al asignar rol");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const removeRole = async (roleId) => {
    try {
      setLoading(true);
      await deleteRole(roleId);
      await fetchAllRoles();
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar el rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        roles,
        loading,
        error,
        fetchAllRoles,
        createNewRole,
        updateRoleData,
        //assignRole,
        removeRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
