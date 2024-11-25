import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Spinner,
} from "@nextui-org/react";
import { useRole } from "../../context/RoleContext";

// Servicio para obtener usuarios
const fetchUsers = async () => {
  try {
    const response = await fetch("http://localhost:8082/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate de enviar el token
      },
    });
    if (!response.ok) throw new Error("Error al obtener usuarios");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const RoleModal = ({ isOpen, onClose, editingRole = null }) => {
  const { createNewRole, updateRoleData } = useRole();
  const isEditing = Boolean(editingRole);

  const initialState = {
    roleId: "",
    nameRole: "",
    permissions: [],
    roleUsers: [], // IDs de usuarios asignados al rol
  };

  const [role, setRole] = useState(initialState);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar usuarios cuando se abre el modal
  useEffect(() => {
    const loadUsers = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          const userData = await fetchUsers();
          setUsers(userData);
        } catch (err) {
          setError("Error al cargar usuarios");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadUsers();
  }, [isOpen]);

  // Cargar datos del rol cuando se está editando
  useEffect(() => {
    if (editingRole) {
      const formattedRole = {
        ...editingRole,
        permissions: editingRole.permissions || [],
        roleUsers: editingRole.roleUsers || [],
      };
      setRole(formattedRole);
    } else {
      setRole(initialState);
    }
  }, [editingRole, isOpen]);

  const handleChange = (name, value) => {
    setRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserToggle = (userId) => {
    setRole((prev) => {
      const updatedUsers = prev.roleUsers.includes(userId)
        ? prev.roleUsers.filter((id) => id !== userId)
        : [...prev.roleUsers, userId];

      return {
        ...prev,
        roleUsers: updatedUsers,
      };
    });
  };

  const generateRoleId = () => {
    return "ROLE-" + Date.now();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const roleData = {
        ...role,
        permissions: role.permissions,
        roleUsers: role.roleUsers,
      };

      if (isEditing) {
        await updateRoleData(role.roleId, roleData);
      } else {
        const newRole = {
          ...roleData,
          roleId: generateRoleId(),
        };
        await createNewRole(newRole);
      }
      onClose();
      setRole(initialState);
    } catch (error) {
      console.error(
        `Error al ${isEditing ? "actualizar" : "crear"} el rol:`,
        error,
      );
      alert(`Error al ${isEditing ? "actualizar" : "crear"} el rol`);
    }
  };

  const handleClose = () => {
    setRole(initialState);
    onClose();
  };

  const modalKey = isEditing ? `edit-${role.roleId}` : "create-role";

  return (
    <Modal key={modalKey} isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent key={`content-${modalKey}`}>
        {() => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              {isEditing ? "Editar Rol" : "Crear Nuevo Rol"}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  key="input-name"
                  label="Nombre del Rol"
                  placeholder="Ingrese el nombre del rol"
                  value={role.nameRole}
                  onChange={(e) => handleChange("nameRole", e.target.value)}
                  required
                />

                {/* Sección de selección de usuarios */}
                <div className="w-full">
                  <p className="text-sm font-medium mb-2">Asignar Usuarios</p>
                  {loading ? (
                    <div className="flex justify-center">
                      <Spinner size="sm" />
                    </div>
                  ) : error ? (
                    <p className="text-danger text-sm">{error}</p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 py-1"
                        >
                          <Checkbox
                            isSelected={role.roleUsers.includes(user.id)}
                            onValueChange={() => handleUserToggle(user.id)}
                          >
                            {user.name} ({user.email})
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                {isEditing ? "Guardar Cambios" : "Crear Rol"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RoleModal;
