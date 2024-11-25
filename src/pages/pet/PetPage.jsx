import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { usePet } from "../../context/PetContext";
import CustomTable from "../../components/CustomTable";
import EditPetModal from "./EditPetModal";
import DeletePetModal from "./DeletePetModal";
import AddPetModal from "./AddPetModal";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function PetPages() {
  const { pets, fetchAllPets } = usePet();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    fetchAllPets();
  }, []);

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setIsEditModalOpen(true);
  };

  const handleDelete = (pet) => {
    setSelectedPet(pet);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPet(null);
    fetchAllPets();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPet(null);
    fetchAllPets();
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    fetchAllPets();
  };

  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NOMBRE", uid: "name", sortable: true },
    { name: "ESPECIE", uid: "species", sortable: true },
    { name: "RAZA", uid: "breed" },
    { name: "FECHA DE NACIMIENTO", uid: "birthDate" },
    { name: "PESO", uid: "weight" },
    { name: "ESTADO", uid: "active" },
    { name: "IDENTIFICACIÓN DEL DUEÑO", uid: "ownerId" },
    { name: "ACCIONES", uid: "actions" },
  ];

  const initialVisibleColumns = [
    "id",
    "name",
    "species",
    "breed",
    "birthDate",
    "weight",
    "ownerId",
    "actions",
  ];

  const renderCell = (pet, columnKey) => {
    switch (columnKey) {
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
                  onClick={() => handleEdit(pet)}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  startContent={<FaTrash />}
                  onClick={() => handleDelete(pet)}
                  className="text-danger"
                >
                  Eliminar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return pet[columnKey];
    }
  };

  return (
    <DefaultLayout>
      <div className="p-2 flex justify-between items-center">
        <h2 className="text-gray-800 text-2xl font-bold">Mascotas</h2>
        <Button color="primary" startContent={<FaPlus />} onClick={handleAdd}>
          Añadir Mascota
        </Button>
      </div>
      <CustomTable
        elements={pets}
        name="Mascotas"
        columns={columns}
        initialVisibleColumns={initialVisibleColumns}
        renderCell={renderCell}
        filterProperty="name"
      />
      <EditPetModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        pet={selectedPet}
      />
      <DeletePetModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        pet={selectedPet}
      />
      <AddPetModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
    </DefaultLayout>
  );
}

export default PetPages;
