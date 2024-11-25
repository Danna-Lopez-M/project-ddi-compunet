import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { usePet } from "../../context/PetContext";
import Alert from "../../components/Alert";

const EditPetModal = ({ isOpen, onClose, pet }) => {
  const { updatePetData, error, loading, clearError } = usePet();
  const [formData, setFormData] = useState({
    name: "",
    weight: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    type: true,
    title: "",
    message: "",
  });

  const alertTimerRef = useRef(null);

  // Función mejorada para limpiar el temporizador
  const clearAlertTimer = () => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }
  };

  // Función mejorada para mostrar alertas
  const showAlert = (type, title, message) => {
    // Primero limpiamos cualquier temporizador existente
    clearAlertTimer();

    // Actualizamos el estado de la alerta
    setAlert({
      show: true,
      type,
      title,
      message,
    });

    // Configuramos el nuevo temporizador
    alertTimerRef.current = setTimeout(() => {
      handleCloseAlert();
    }, 5000);
  };

  // Nueva función unificada para cerrar alertas
  const handleCloseAlert = () => {
    clearAlertTimer();
    setAlert((prev) => ({ ...prev, show: false }));
    clearError();
  };

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || "",
        weight: pet.weight?.toString() || "",
      });
    }
  }, [pet]);

  useEffect(() => {
    if (error) {
      let errorMessage;
      if (typeof error === "object" && error.response?.data) {
        errorMessage = error.response.data;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = "Error al actualizar la mascota";
      }

      onClose();
      showAlert(true, "Error", errorMessage);
    }
  }, [error, onClose, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        ...pet,
        ...formData,
        weight: parseFloat(formData.weight) || 0,
      };
      await updatePetData(pet.id, updatedData);

      if (!error) {
        onClose();
        showAlert(
          false,
          "¡Éxito!",
          "La mascota ha sido actualizada correctamente",
        );
      }
    } catch (err) {
      onClose();
      showAlert(true, "Error", "Error al procesar la solicitud");
    }
  };

  const handleModalClose = () => {
    clearAlertTimer();
    clearError();
    onClose();
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      clearAlertTimer();
      clearError();
    };
  }, [clearError]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar Mascota
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Nombre"
                placeholder="Nombre de la mascota"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="bordered"
              />
              <Input
                label="Peso"
                placeholder="Peso de la mascota"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                variant="bordered"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">kg</span>
                  </div>
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleModalClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {alert.show && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
};

export default EditPetModal;
