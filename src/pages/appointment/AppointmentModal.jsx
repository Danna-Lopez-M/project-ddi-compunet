import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@nextui-org/react";
import { useAppointment } from "../../context/AppointmentContext";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import CustomInput from "../../components/CustomInput";
import CustomSelect from "../../components/CustomSelect";
import Alert from "../../components/Alert";
import { useUser } from "../../context/UserContext";

export function AppointmentModal({ isOpen, onClose, appointmentToEdit }) {
  const {
    createNewAppointment,
    updateAppointmentData,
    errors: modalErrors,
  } = useAppointment();
  const [formKey, setFormKey] = useState(0);
  const [visibleErrors, setVisibleErrors] = useState([]);
  const { users, fetchAllUsers } = useUser();
  const [veterinarians, setVeterinarians] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dateDates: "",
      hourapp: "",
      petsIdPet: "",
      statesTypeStates: "Scheduled",
      observations: "",
      idUser: "",
    },
  });

  useEffect(() => {
    setVisibleErrors(modalErrors);
  }, [modalErrors]);

  useEffect(() => {
    if (isOpen && users.length === 0) {
      fetchAllUsers();
    }
  }, [isOpen, users.length, fetchAllUsers]);

  useEffect(() => {
    const filteredVets = users
      .filter((user) => user.roles.includes("Veterinary") && user.active)
      .map((vet) => ({
        value: vet.id,
        label: `${vet.name} - ${vet.email}`,
      }));
    setVeterinarians(filteredVets);
  }, [users]);

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isOpen) {
      if (appointmentToEdit) {
        setValue("dateDates", appointmentToEdit.dateDates || "");
        setValue("hourapp", appointmentToEdit.hourapp || "");
        setValue(
          "statesTypeStates",
          appointmentToEdit.statesTypeStates || "Scheduled",
        );
        setValue("observations", appointmentToEdit.observations || "");
        setValue("petsIdPet", appointmentToEdit.pet?.id || "");
        setValue("idUser", appointmentToEdit.user?.id || "");
      } else {
        reset();
      }
    }
    setFormKey((prev) => prev + 1);
  }, [isOpen, appointmentToEdit, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      if (appointmentToEdit) {
        await updateAppointmentData(appointmentToEdit.idAppointment, data);
      } else {
        await createNewAppointment(data);
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const statusOptions = [
    { value: "Scheduled", label: "Pendiente" },
    { value: "Completed", label: "Completada" },
    { value: "Cancelled", label: "Cancelada" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" key={formKey}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {appointmentToEdit ? "Editar Cita" : "Nueva Cita"}
          </ModalHeader>
          <ModalBody className="gap-4">
            {(visibleErrors || []).map((error, i) => (
              <Alert
                type={true}
                title="Error"
                message={error}
                key={i}
                onClose={() => handleCloseAlert(i)}
              />
            ))}
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                type="date"
                label="Fecha"
                name="dateDates"
                register={register}
                min={format(new Date(), "yyyy-MM-dd")}
                errors={errors}
                errorMessage={errors.dateDates?.message}
              />

              <CustomInput
                type="time"
                label="Hora"
                name="hourapp"
                register={register}
                min="08:00"
                max="16:00"
                errors={errors}
                errorMessage={errors.hourapp?.message}
              />
            </div>

            <CustomInput
              type="text"
              label="ID Mascota"
              name="petsIdPet"
              placeholder="Ingrese el ID de la mascota"
              register={register}
              errors={errors}
              errorMessage="La mascota es requerida"
            />

            <CustomSelect
              label="Estado"
              name="statesTypeStates"
              options={statusOptions}
              placeholder="Seleccione un estado"
              register={register}
              errors={errors}
              errorMessage="El estado es requerido"
            />

            <Textarea
              {...register("observations")}
              label="Observaciones"
              placeholder="Ingrese las observaciones"
              variant="bordered"
              radius="sm"
              labelPlacement="outside"
              classNames={{
                label: "text-black",
              }}
            />

            <CustomSelect
              label="Veterinario"
              name="idUser"
              options={veterinarians}
              placeholder="Seleccione un veterinario"
              register={register}
              errors={errors}
              errorMessage="El veterinario es requerido"
              value={appointmentToEdit?.user?.id}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              className="bg-primary-dark text-white hover:bg-primary"
              type="submit"
            >
              {appointmentToEdit ? "Actualizar" : "Crear"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
