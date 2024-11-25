import { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { Button } from "@nextui-org/react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTreatments } from "../../context/TreatmentContext";
import TreatmentModal from "./TreatmentModal";

function TreatmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { treatments, loading, error, fetchTreatments, removeTreatment } =
    useTreatments();

  const columns = [
    { name: "ID", uid: "idTrataments", sortable: true },
    { name: "Mascota", uid: "petId", sortable: true },
    { name: "Cita", uid: "appoinmentIdAppointment", sortable: true },
    { name: "Inicio", uid: "dateStart", sortable: true },
    { name: "Finalización", uid: "dateFinish", sortable: true },
    { name: "Frecuencia", uid: "frequency", sortable: true },
    { name: "Dosis", uid: "dosage", sortable: true },
    { name: "Descripción", uid: "descriptiont", sortable: false },
    { name: "Acciones", uid: "actions", sortable: false },
  ];

  useEffect(() => {
    fetchTreatments();
  }, [refreshTrigger]);

  const renderCell = (treatment, columnKey) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex justify-center gap-2">
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onClick={() => handleEdit(treatment)}
            >
              <FaEdit className="text-primary" />
            </Button>
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              color="danger"
              onClick={() => handleDelete(treatment.idTrataments)}
            >
              <FaTrash className="text-danger" />
            </Button>
          </div>
        );
      default:
        return treatment[columnKey] || "N/A";
    }
  };

  const transformedTreatments = Array.isArray(treatments)
    ? treatments
        .filter((treatment) => {
          return (
            typeof treatment === "object" &&
            treatment !== null &&
            (treatment.idTrataments ||
              (treatment.data && treatment.data.idTrataments))
          );
        })
        .map((treatmentResponse) => {
          const treatmentData = treatmentResponse.data || treatmentResponse;
          return {
            ...treatmentData,
            id: treatmentData.idTrataments,
            key: treatmentData.idTrataments,
          };
        })
    : [];

  const handleCreate = () => {
    setEditingTreatment(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTreatment(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = (treatment) => {
    setEditingTreatment(treatment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas eliminar este tratamiento?",
    );
    if (confirm) {
      await removeTreatment(id);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestión de Tratamientos</h1>
          </div>
          <div className="text-center py-4">Cargando...</div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <div className="p-2">
          <h2 className="text-gray-800 text-2xl font-bold">
            Gestión de Tratamientos
          </h2>
        </div>

        {error && (
          <div className="text-red-500">
            Error al cargar los tratamientos: {error}
          </div>
        )}

        <CustomTable
          elements={transformedTreatments}
          name="Tratamientos"
          columns={columns}
          initialVisibleColumns={[
            "idTrataments",
            "petId",
            "appoinmentIdAppointment",
            "dateStart",
            "dateFinish",
            "frequency",
            "dosage",
            "actions",
          ]}
          handleCreate={handleCreate}
          renderCell={renderCell}
          filterProperty="descriptiont"
          additionalFilter={{
            label: "Filtrar por mascota",
            field: "petId",
          }}
        />

        <TreatmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingTreatment={editingTreatment}
        />
      </div>
    </DefaultLayout>
  );
}

export default TreatmentsPage;
