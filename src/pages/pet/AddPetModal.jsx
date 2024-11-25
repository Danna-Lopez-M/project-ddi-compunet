import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Alert from "../../components/Alert"; // Updated import for custom Alert
import { usePet } from "../../context/PetContext";

function AddPetModal({ isOpen, onClose }) {
  const { registerPet } = usePet();
  const [alert, setAlert] = useState({
    show: false,
    type: false,
    title: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    species: "",
    breed: "",
    birhDate: "",
    weight: "",
    ownerId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      species: "",
      breed: "",
      birtDate: "",
      weight: "",
      ownerId: "",
    });
    setAlert({ show: false, type: false, title: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPet({ ...formData, id: null });
      setAlert({
        show: true,
        type: false, // false for success
        title: "¡Éxito!",
        message: "Mascota registrada exitosamente",
      });

      // Esperar 2 segundos antes de cerrar el modal y resetear el formulario
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      setAlert({
        show: true,
        type: true, // true for error
        title: "Error",
        message: error.message,
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAlertClose = () => {
    setAlert({ show: false, type: false, title: "", message: "" });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Añadir Nueva Mascota
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Especie"
                  name="species"
                  selectedKeys={formData.species ? [formData.species] : []}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: "species", value: e.target.value },
                    })
                  }
                  required
                >
                  <SelectItem key="dog" value="dog">
                    Perro
                  </SelectItem>
                  <SelectItem key="cat" value="cat">
                    Gato
                  </SelectItem>
                  <SelectItem key="other" value="other">
                    Otro
                  </SelectItem>
                </Select>
                <Input
                  label="Raza"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Fecha de Nacimiento"
                  name="birhDate"
                  type="date"
                  value={formData.birhDate}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Peso (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="ID del Dueño"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                Guardar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {alert.show && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
        />
      )}
    </>
  );
}

export default AddPetModal;
