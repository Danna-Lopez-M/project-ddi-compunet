import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useRole } from "../../context/RoleContext";
import { Button, Chip } from "@nextui-org/react";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import RoleModal from "./RoleModal";
import CustomTable from "../../components/CustomTable";

function RolePage() {
  const { roles, fetchAllRoles, removeRole } = useRole();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);

  useEffect(() => {
    fetchAllRoles();
  }, []);

  const handleEdit = (role) => {
    setRoleToEdit(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRoleToEdit(null);
    fetchAllRoles();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este rol?")) {
      try {
        await removeRole(id);
        fetchAllRoles();
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
      }
    }
  };

  const handleCreateNew = () => {
    setRoleToEdit(null);
    setIsModalOpen(true);
  };

  const transformedRoles =
    roles?.map((role) => ({
      ...role,
      id: role.roleId,
    })) || [];

  const columns = [
    { name: "ID", uid: "roleId", sortable: true },
    { name: "NOMBRE", uid: "nameRole", sortable: true },
    { name: "ACCIONES", uid: "actions" },
  ];

  const renderCell = (role, columnKey) => {
    switch (columnKey) {
      case "roleId":
        return <span className="text-xs">{role.roleId}</span>;
      case "nameRole":
        return <span className="font-medium">{role.nameRole}</span>;
      case "actions":
        return (
          <div className="flex justify-center gap-2">
            {/* <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onPress={() => handleEdit(role)}
            >
              <FaEdit className="text-primary" />
            </Button> */}
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              color="danger"
              onPress={() => handleDelete(role.roleId)}
              isDisabled={role.usersCount > 0}
            >
              <FaTrash className="text-danger" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const Modal = () => (
    <RoleModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      editingRole={roleToEdit}
    />
  );

  return (
    <DefaultLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-2xl font-bold">Roles</h2>
          <Button color="primary" onPress={handleCreateNew} className="px-4">
            Crear Nuevo Rol
          </Button>
        </div>

        <CustomTable
          elements={transformedRoles}
          name="roles"
          columns={columns}
          initialVisibleColumns={["roleId", "nameRole", "actions"]}
          renderCell={renderCell}
          filterProperty="nameRole"
          Modal={Modal}
          emptyContent="No hay roles disponibles"
        />
      </div>
    </DefaultLayout>
  );
}

export default RolePage;
