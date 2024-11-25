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
import { useTreatments } from "../../context/TreatmentContext";

const TreatmentModal = ({
  isOpen,
  onClose,
  editingTreatment = null,
  appointment = null,
}) => {
  const { addTreatment, editTreatment } = useTreatments();
  const isEditing = Boolean(editingTreatment);

  const initialState = {
    idTrataments: "",
    descriptiont: "",
    dosage: "",
    frequency: "",
    dateStart: "",
    dateFinish: "",
    appoinmentIdAppointment: "",
    petId: "",
  };

  const [treatment, setTreatment] = useState(initialState);

  useEffect(() => {
    if (editingTreatment) {
      // Asegurarse de que appointmentId no sea null
      const formattedTreatment = {
        ...editingTreatment,
        appoinmentIdAppointment: editingTreatment.appoinmentIdAppointment || "",
      };
      setTreatment(formattedTreatment);
    } else if (appointment) {
      // Pre-rellenar los campos desde una cita
      setTreatment((prev) => ({
        ...prev,
        appoinmentIdAppointment: appointment.idAppointment,
        petId: appointment.pet.id,
      }));
    } else {
      setTreatment(initialState);
    }
  }, [editingTreatment, appointment, isOpen]);

  const handleChange = (name, value) => {
    setTreatment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateTreatmentId = () => {
    return "TRT-" + Date.now();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const treatmentData = {
        ...treatment,
        // AppointmentId sea un string válido o null
        appoinmentIdAppointment:
          treatment.appoinmentIdAppointment.trim() || null,
      };

      if (isEditing) {
        await editTreatment(treatment.idTrataments, treatmentData);
      } else {
        const newTreatment = {
          ...treatmentData,
          idTrataments: generateTreatmentId(),
        };
        await addTreatment(newTreatment);
      }
      onClose();
      setTreatment(initialState);
    } catch (error) {
      console.error(
        `Error al ${isEditing ? "actualizar" : "crear"} el tratamiento:`,
        error,
      );
      alert(`Error al ${isEditing ? "actualizar" : "crear"} el tratamiento`);
    }
  };

  const handleClose = () => {
    setTreatment(initialState);
    onClose();
  };

  const modalKey = isEditing
    ? `edit-${treatment.idTrataments}`
    : "create-treatment";

  return (
    <Modal key={modalKey} isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent key={`content-${modalKey}`}>
        {() => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              {isEditing ? "Editar Tratamiento" : "Crear Nuevo Tratamiento"}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  key="input-description"
                  label="Descripción"
                  placeholder="Ingrese la descripción"
                  value={treatment.descriptiont}
                  onChange={(e) => handleChange("descriptiont", e.target.value)}
                  required
                />
                <Input
                  key="input-dosage"
                  label="Dosis"
                  placeholder="Ingrese la dosis"
                  value={treatment.dosage}
                  onChange={(e) => handleChange("dosage", e.target.value)}
                  required
                />
                <Input
                  key="input-frequency"
                  label="Frecuencia"
                  placeholder="Ingrese la frecuencia"
                  value={treatment.frequency}
                  onChange={(e) => handleChange("frequency", e.target.value)}
                  required
                />
                <Input
                  key="input-dateStart"
                  type="date"
                  label="Fecha de inicio"
                  value={treatment.dateStart}
                  onChange={(e) => handleChange("dateStart", e.target.value)}
                  required
                />
                <Input
                  key="input-dateFinish"
                  type="date"
                  label="Fecha de finalización"
                  value={treatment.dateFinish}
                  onChange={(e) => handleChange("dateFinish", e.target.value)}
                />
                <Input
                  key="input-appointment"
                  label="Id de la cita médica"
                  placeholder="Ingrese el ID de la cita médica"
                  value={treatment.appoinmentIdAppointment || ""}
                  onChange={(e) =>
                    handleChange("appoinmentIdAppointment", e.target.value)
                  }
                  readOnly={Boolean(appointment)}
                />
                <Input
                  key="input-pet"
                  label="ID de Mascota"
                  placeholder="Ingrese el ID de la mascota"
                  value={treatment.petId}
                  onChange={(e) => handleChange("petId", e.target.value)}
                  readOnly={Boolean(appointment)}
                  required
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                {isEditing ? "Guardar Cambios" : "Crear Tratamiento"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TreatmentModal;
