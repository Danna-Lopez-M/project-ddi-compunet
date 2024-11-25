import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { usePet } from "../../context/PetContext";
import Alert from "../../components/Alert";

const DeletePetModal = ({ isOpen, onClose, pet }) => {
  const { removePet, error, loading, clearError } = usePet();
  const [alert, setAlert] = useState({
    show: false,
    type: true,
    title: "",
    message: "",
  });

  const alertTimerRef = useRef(null);

  const clearAlertTimer = () => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }
  };

  const showAlert = (type, title, message) => {
    clearAlertTimer();

    setAlert({
      show: true,
      type,
      title,
      message,
    });

    alertTimerRef.current = setTimeout(() => {
      handleCloseAlert();
    }, 5000);
  };

  const handleCloseAlert = () => {
    clearAlertTimer();
    setAlert((prev) => ({ ...prev, show: false }));
    clearError();
  };

  useEffect(() => {
    if (error) {
      let errorMessage;
      if (typeof error === "object" && error.response?.data) {
        errorMessage = error.response.data;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = "Error al eliminar la mascota";
      }

      onClose();
      showAlert(true, "Error", errorMessage);
    }
  }, [error, onClose, clearError]);

  const handleDelete = async () => {
    try {
      await removePet(pet.id);

      if (!error) {
        onClose();
        showAlert(
          false,
          "¡Éxito!",
          "La mascota ha sido eliminada correctamente",
        );
      }
    } catch (err) {
      onClose();
      showAlert(true, "Error", "Error al eliminar la mascota");
    }
  };

  const handleModalClose = () => {
    clearAlertTimer();
    clearError();
    onClose();
  };

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
            Eliminar Mascota
          </ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro que deseas eliminar a la mascota{" "}
              <span className="font-bold">{pet?.name}</span>?
            </p>
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={handleModalClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={handleDelete} isLoading={loading}>
              Eliminar
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

export default DeletePetModal;
