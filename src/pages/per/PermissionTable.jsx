import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { usePermission } from "../../context/PermissionContext";
import { Spinner } from "@nextui-org/spinner";

const PermissionsTable = () => {
  const {
    permissions,
    roles,
    rolePermissions,
    loading,
    error,
    fetchAllRolePermissions,
    updatePermissionData,
  } = usePermission();

  const [localPermissions, setLocalPermissions] = useState({});
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    fetchAllRolePermissions();
  }, []);

  useEffect(() => {
    if (rolePermissions) {
      setLocalPermissions(rolePermissions);
    }
  }, [rolePermissions]);

  const handlePermissionChange = (roleId, permission) => {
    setLocalPermissions((prev) => {
      const updated = { ...prev };
      const currentRolePermissions = updated[roleId] || [];

      if (currentRolePermissions.includes(permission)) {
        // Si el permiso ya existe, lo removemos
        updated[roleId] = currentRolePermissions.filter(
          (p) => p !== permission,
        );
      } else {
        // Si el permiso no existe, lo agregamos
        updated[roleId] = [...currentRolePermissions, permission];
      }

      // Si el array quedó vacío, mantenemos la propiedad con un array vacío
      if (!updated[roleId]) {
        updated[roleId] = [];
      }

      setIsModified(true);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviamos solo los datos necesarios al backend
      const permissionsToUpdate = {};
      roles.forEach((role) => {
        const roleId = role.roleId.toString();
        permissionsToUpdate[roleId] = localPermissions[roleId] || [];
      });

      await updatePermissionData(permissionsToUpdate);
      setIsModified(false);
    } catch (error) {
      console.error("Error al actualizar permisos:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-red-500 text-center">
        Error al cargar los permisos: {error}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex justify-between items-center pb-4">
        <h2 className="text-2xl font-bold text-[#DE5D83]">
          Permisos de Usuario
        </h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <Table
            aria-label="Tabla de permisos de usuario"
            className="mb-4"
            shadow="none"
            classNames={{
              th: "bg-[#DE5D83] text-white",
              td: "text-center",
            }}
          >
            <TableHeader>
              <TableColumn>Permisos</TableColumn>
              {roles.map((role) => (
                <TableColumn key={role.roleId}>{role.nameRole}</TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.namePermission}>
                  <TableCell>{permission.namePermission}</TableCell>
                  {roles.map((role) => (
                    <TableCell
                      key={`${role.roleId}-${permission.namePermission}`}
                      className="text-center"
                    >
                      <Checkbox
                        isSelected={localPermissions[role.roleId]?.includes(
                          permission.namePermission,
                        )}
                        onValueChange={() =>
                          handlePermissionChange(
                            role.roleId,
                            permission.namePermission,
                          )
                        }
                        color="secondary"
                        classNames={{
                          wrapper: "before:border-[#DE5D83]",
                          icon: "text-white",
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              color="secondary"
              className="bg-[#DE5D83] text-white"
              size="lg"
              isDisabled={!isModified}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default PermissionsTable;
