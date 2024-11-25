import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useUser } from "../../context/UserContext";
import CustomTable from "../../components/CustomTable";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineToggleOn } from "react-icons/md";
import { UserModal } from "./UserModal";

function UserPage() {
  const { users, fetchAllUsers, toggleUserActive, removeUser } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleEdit = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
    fetchAllUsers();
  };

  const handleDelete = async (id) => {
    await removeUser(id);
  };

  const handleActivate = async (id) => {
    await toggleUserActive(id);
  };

  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NOMBRE", uid: "name", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "TELÉFONO", uid: "phone" },
    { name: "DIRECCIÓN", uid: "address" },
    { name: "Roles", uid: "roles" },
    { name: "ESTADO", uid: "active" },
    { name: "ACCIONES", uid: "actions" },
  ];

  const initialVisibleColumns = [
    "id",
    "name",
    "email",
    "phone",
    "address",
    "roles",
    "active",
    "actions",
  ];

  const renderCell = (user, columnKey) => {
    switch (columnKey) {
      case "active":
        return user.active ? (
          <span className="badge bg-success rounded-full text-background px-2 py-1">
            Activo
          </span>
        ) : (
          <span className="badge bg-danger rounded-full text-background px-2 py-1">
            Inactivo
          </span>
        );
      case "actions":
        return (
          <div className="relative flex justify-center items-center">
            <Dropdown className="bg-background border-1 border-primary">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <FaEdit className="text-primary" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                color="primary"
                variant="bordered"
                disallowEmptySelection
              >
                <DropdownItem
                  startContent={<FaEdit />}
                  onClick={() => handleEdit(user)}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  startContent={<MdOutlineToggleOn />}
                  onClick={() =>
                    user.active
                      ? handleDelete(user.id)
                      : handleActivate(user.id)
                  }
                >
                  {user.active ? "Desactivar" : "Activar"}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return user[columnKey];
    }
  };

  return (
    <DefaultLayout>
      <div className="p-2">
        <h2 className="text-gray-800 text-2xl font-bold">Usuarios</h2>
      </div>
      <CustomTable
        elements={users}
        name="Usuarios"
        columns={columns}
        initialVisibleColumns={initialVisibleColumns}
        renderCell={renderCell}
        filterProperty="name"
      />
      <UserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        userToEdit={userToEdit}
      />
    </DefaultLayout>
  );
}

export default UserPage;
