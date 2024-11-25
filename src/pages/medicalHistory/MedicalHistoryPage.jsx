import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useMedicalHistory } from "../../context/MedicalHistoryContext";
import { usePet } from "../../context/PetContext";
import CustomSelect from "../../components/CustomSelect";
import CustomTable from "../../components/CustomTable";
import { Card, CardHeader, CardBody, Button, Spinner } from "@nextui-org/react";
import { IoEyeSharp } from "react-icons/io5";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Alert from "../../components/Alert";
import ViewTreatmentsModal from "../treatment/ViewTreatmentsModal";
import { useForm } from "react-hook-form";

function MedicalHistoryPage() {
  const {
    medicalHistory,
    error: medicalHistoryError,
    loading: medicalHistoryLoading,
    fetchMedicalHistoryByPetId,
  } = useMedicalHistory();

  const {
    pets,
    loading: petsLoading,
    error: petsError,
    fetchAllPets,
  } = usePet();

  const { register, setValue } = useForm();
  const [selectedPetId, setSelectedPetId] = useState("");
  const [visibleErrors, setVisibleErrors] = useState([]);
  const [isViewTreatmentsModalOpen, setIsViewTreatmentsModalOpen] =
    useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAllPets();
  }, []);

  useEffect(() => {
    const errors = [];
    if (medicalHistoryError) errors.push(medicalHistoryError);
    if (petsError) errors.push(petsError);
    if (errors.length > 0) {
      setVisibleErrors(errors);
    }
  }, [medicalHistoryError, petsError]);

  const handlePetChange = async (event) => {
    const petId = event.target.value;
    setSelectedPetId(petId);
    setValue("petId", petId);

    if (petId) {
      try {
        await fetchMedicalHistoryByPetId(petId);
      } catch (error) {
        setVisibleErrors((prev) => [
          ...prev,
          "Error al obtener el historial médico",
        ]);
      }
    }
  };

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const handleViewTreatments = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewTreatmentsModalOpen(true);
  };

  const handleCloseViewTreatments = () => {
    setIsViewTreatmentsModalOpen(false);
    setSelectedAppointment(null);
  };

  const columns = [
    { name: "ID", uid: "idAppointment" },
    { name: "FECHA", uid: "date", sortable: true },
    { name: "HORA", uid: "hour", sortable: true },
    { name: "ESTADO", uid: "status" },
    { name: "OBSERVACIONES", uid: "observations" },
    { name: "VETERINARIO", uid: "veterinarianName" },
    { name: "ACCIONES", uid: "actions" },
  ];

  const initialVisibleColumns = [
    "date",
    "hour",
    "status",
    "observations",
    "veterinarianName",
    "actions",
  ];

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  const renderCell = (appointment, columnKey) => {
    switch (columnKey) {
      case "date":
        return format(
          new Date(appointment.date + "T00:00:00"),
          "dd 'de' MMMM, yyyy",
          { locale: es },
        );

      case "hourapp":
        return format(new Date(`2000-01-01T${appointment.hour}`), "hh:mm a");

      case "status":
        return (
          <span
            className={`badge rounded-full text-background px-2 py-1 ${
              appointment.status === "Scheduled"
                ? "bg-warning"
                : appointment.status === "Completed"
                  ? "bg-success"
                  : appointment.status === "Cancelled"
                    ? "bg-error"
                    : "bg-primary"
            }`}
          >
            {appointment.status}
          </span>
        );

      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onClick={() => handleViewTreatments(appointment)}
            >
              <IoEyeSharp className="text-primary" />
            </Button>
          </div>
        );

      case "observations":
        return (
          <div className="max-w-xs truncate">{appointment[columnKey]}</div>
        );

      default:
        return appointment[columnKey];
    }
  };

  return (
    <DefaultLayout>
      {visibleErrors.map((error, i) => (
        <Alert
          type={true}
          title="Error"
          message={error}
          key={i}
          onClose={() => handleCloseAlert(i)}
        />
      ))}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 text-2xl font-bold">Historial Médico</h2>
        </div>

        {petsLoading ? (
          <div className="flex justify-center p-4">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="mb-6">
            <CustomSelect
              register={register}
              label="Seleccionar Mascota"
              placeholder="Seleccione una mascota"
              name="petId"
              options={pets.map((pet) => ({
                value: pet.id,
                label: pet.name,
              }))}
              value={selectedPetId}
              onChange={handlePetChange}
              errors={{}}
            />
          </div>
        )}

        {selectedPet && (
          <Card className="mb-6">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="text-large font-bold">
                Información de la Mascota
              </h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold">Nombre:</p>
                  <p>{selectedPet.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Especie:</p>
                  <p>{selectedPet.species}</p>
                </div>
                <div>
                  <p className="font-semibold">Raza:</p>
                  <p>{selectedPet.breed}</p>
                </div>
                <div>
                  <p className="font-semibold">Fecha de Nacimiento:</p>
                  <p>{selectedPet.birhDate}</p>
                </div>
                <div>
                  <p className="font-semibold">Peso:</p>
                  <p>{selectedPet.weight} kg</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {selectedPetId && (
          <>
            {medicalHistoryLoading ? (
              <div className="flex justify-center p-4">
                <Spinner size="lg" />
              </div>
            ) : (
              <CustomTable
                elements={medicalHistory}
                name="Historial de Citas"
                columns={columns}
                initialVisibleColumns={initialVisibleColumns}
                renderCell={renderCell}
                filterProperty="idAppointment"
              />
            )}
          </>
        )}

        <ViewTreatmentsModal
          isOpen={isViewTreatmentsModalOpen}
          onClose={handleCloseViewTreatments}
          appointment={selectedAppointment}
        />
      </div>
    </DefaultLayout>
  );
}

export default MedicalHistoryPage;
