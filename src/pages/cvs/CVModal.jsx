import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useCv } from "../../context/CvContext";

const CVModal = ({ isOpen, onClose, editingCV = null }) => {
  const { addCV, editCV } = useCv();
  const isEditing = Boolean(editingCV);

  const initialState = {
    cvId: "",
    idUser: "",
    speciality: "",
    descriptioncv: "",
  };

  const [cv, setCV] = useState(initialState);

  useEffect(() => {
    if (editingCV) {
      const formattedCV = {
        ...editingCV,
        idUser: editingCV.idUser || "",
      };
      setCV(formattedCV);
    } else {
      setCV(initialState);
    }
  }, [editingCV, isOpen]);

  const handleChange = (name, value) => {
    setCV((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateCVId = () => {
    return "CV-" + Date.now();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cvData = {
        ...cv,
        idUser: cv.idUser.trim() || null,
      };

      if (isEditing) {
        await editCV(cv.cvId, cvData);
      } else {
        const newCV = {
          ...cvData,
          cvId: generateCVId(),
        };
        await addCV(newCV);
      }
      onClose();
      setCV(initialState);
    } catch (error) {
      console.error(
        `Error al ${isEditing ? "actualizar" : "crear"} el CV:`,
        error,
      );
      alert(`Error al ${isEditing ? "actualizar" : "crear"} el CV`);
    }
  };

  const handleClose = () => {
    setCV(initialState);
    onClose();
  };

  // Generar la key dinámica basada en la acción (crear/editar) y en el id del CV
  const modalKey = isEditing ? `edit-${cv.cvId}` : "create-cv";

  return (
    <Modal key={modalKey} isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent key={`content-${modalKey}`}>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {isEditing ? "Editar CV" : "Crear Nuevo CV"}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                key="input-user"
                label="ID de Usuario"
                placeholder="Ingrese el ID del usuario"
                value={cv.idUser}
                onChange={(e) => handleChange("idUser", e.target.value)}
                required
              />
              <Input
                key="input-speciality"
                label="Especialidad"
                placeholder="Ingrese la especialidad"
                value={cv.speciality}
                onChange={(e) => handleChange("speciality", e.target.value)}
                required
              />
              <Input
                key="input-description"
                label="Descripción"
                placeholder="Ingrese la descripción del CV"
                value={cv.descriptioncv}
                onChange={(e) => handleChange("descriptioncv", e.target.value)}
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear CV"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CVModal;
