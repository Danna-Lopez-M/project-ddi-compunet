import { createContext, useContext, useState } from "react";
import { getAllRolePermissions, updateRolePermission } from "../api/permission";

export const PermissionContext = createContext();

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermission debe ser usado dentro de un PermissionProvider",
    );
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllRolePermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllRolePermissions();
      setPermissions(response.data?.permissionList || []);
      setRoles(response.data?.roleus || []);
      setRolePermissions(response.data?.rolePermissionMap || {});
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar los permisos");
    } finally {
      setLoading(false);
    }
  };

  const updatePermissionData = async (updatedPermissions) => {
    try {
      setLoading(true);
      setError(null);

      // Crear el objeto en el formato requerido por el backend
      const formattedPermissions = {};
      Object.keys(updatedPermissions).forEach((roleId) => {
        formattedPermissions[roleId] = updatedPermissions[roleId];
      });

      await updateRolePermission(formattedPermissions);
      setRolePermissions(updatedPermissions);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al actualizar los permisos",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        roles,
        rolePermissions,
        loading,
        error,
        fetchAllRolePermissions,
        updatePermissionData,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
