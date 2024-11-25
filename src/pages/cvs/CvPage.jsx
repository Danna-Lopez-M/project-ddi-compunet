import { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { Button } from "@nextui-org/react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCv } from "../../context/CvContext";
import CVModal from "./CVModal";

function CvPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCV, setEditingCV] = useState(null);
  const { cvs, loading, error, fetchCVs, removeCV } = useCv();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const columns = [
    { name: "ID", uid: "cvId", sortable: true },
    { name: "Usuario", uid: "idUser", sortable: true },
    { name: "Especialidad", uid: "speciality", sortable: true },
    { name: "Descripción", uid: "descriptioncv", sortable: false },
    { name: "Acciones", uid: "actions", sortable: false },
  ];

  const initialVisibleColumns = [
    "cvId",
    "idUser",
    "speciality",
    "descriptioncv",
    "actions",
  ];

  useEffect(() => {
    fetchCVs();
  }, [refreshTrigger]);

  const renderCell = (cv, columnKey) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onPress={() => handleEdit(cv)}
            >
              <FaEdit className="text-primary" />
            </Button>
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              color="danger"
              onClick={() => handleDelete(cv.cvId)}
            >
              <FaTrash className="text-danger" />
            </Button>
          </div>
        );
      default:
        return cv[columnKey] || "N/A";
    }
  };

  // Transformación de datos para manejar la estructura de respuesta
  const transformedCVs = Array.isArray(cvs)
    ? cvs.map((cvResponse) => {
        // Extraer los datos del CV desde la estructura de respuesta
        const cvData = cvResponse.data || cvResponse;

        return {
          ...cvData,
          id: cvData.cvId,
          key: cvData.cvId,
        };
      })
    : [];

  const handleCreate = () => {
    setEditingCV(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCV(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = (cv) => {
    setEditingCV(cv);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas eliminar este CV?",
    );
    if (confirm) {
      await removeCV(id);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestión de CVs</h1>
          </div>
          <div className="text-center py-4">Cargando...</div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de CVs</h1>
        </div>

        {error && (
          <div className="text-red-500">Error al cargar los CVs: {error}</div>
        )}

        <CustomTable
          elements={transformedCVs}
          name="CVs"
          columns={columns}
          initialVisibleColumns={initialVisibleColumns}
          handleCreate={handleCreate}
          renderCell={renderCell}
          filterProperty="speciality"
          keyField="cvId"
        />

        <CVModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingCV={editingCV}
        />
      </div>
    </DefaultLayout>
  );
}

export default CvPage;
