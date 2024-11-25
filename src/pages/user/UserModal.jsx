import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useUser } from "../../context/UserContext";
import CustomInput from "../../components/CustomInput";
import Alert from "../../components/Alert";

export function UserModal({ isOpen, onClose, userToEdit }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const { updateUserData, error: updateError } = useUser();
  const [visibleErrors, setVisibleErrors] = useState([]);

  useEffect(() => {
    if (userToEdit) {
      Object.keys(userToEdit).forEach((key) => {
        setValue(key, userToEdit[key]);
      });
    } else {
      reset();
    }
  }, [userToEdit, setValue, reset]);

  useEffect(() => {
    if (updateError) {
      setVisibleErrors([updateError]);
    }
  }, [updateError]);

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (userToEdit) {
      await updateUserData(userToEdit.id, data);
      onClose();
      reset();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            Editar Usuario
          </ModalHeader>
          <ModalBody>
            {visibleErrors.map((error, i) => (
              <Alert
                type={true}
                title="Error"
                message={error}
                key={i}
                onClose={() => handleCloseAlert(i)}
              />
            ))}
            <CustomInput
              type="text"
              register={register("name", {
                required: "El nombre es obligatorio",
              })}
              label="Nombre"
              placeholder="Ingrese el nombre del usuario"
              name="name"
              errorMessage={errors.name?.message}
              errors={errors}
              defaultValue={userToEdit?.name || ""}
            />
            <CustomInput
              type="email"
              register={register("email", {
                required: "El email es obligatorio",
              })}
              label="Email"
              placeholder="Ingrese el email del usuario"
              name="email"
              errorMessage={errors.email?.message}
              errors={errors}
              defaultValue={userToEdit?.email || ""}
            />
            <CustomInput
              type="tel"
              register={register("phone")}
              label="Teléfono"
              placeholder="Ingrese el teléfono del usuario"
              name="phone"
              errors={errors}
              defaultValue={userToEdit?.phone || ""}
            />
            <CustomInput
              type="text"
              register={register("address")}
              label="Dirección"
              placeholder="Ingrese la dirección del usuario"
              name="address"
              errors={errors}
              defaultValue={userToEdit?.address || ""}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              className="bg-primary-dark text-white hover:bg-primary"
              type="submit"
            >
              Actualizar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
