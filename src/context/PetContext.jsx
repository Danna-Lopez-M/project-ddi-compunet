import { createContext, useContext, useState } from "react";
import {
  getPetById,
  getAllPets,
  updatePet,
  deletePet,
  registerPetRequest,
} from "../api/pet";

export const PetContext = createContext();

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePet debe ser usado dentro de un PetProvider");
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Estado de éxito

  const fetchPetById = async (id) => {
    try {
      setLoading(true);
      const response = await getPetById(id);
      setSelectedPet(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching pet");
    } finally {
      setLoading(false);
    }
  };

  const registerPet = async (pet) => {
    try {
      console.log(pet);
      const res = await registerPetRequest(pet);
      console.log("Pasó");
      setPets((prevPets) => [...prevPets, res.data]);
      setSuccess("Mascota registrada exitosamente."); // Mensaje de éxito

      return res.data;
    } catch (error) {
      console.log("DioError ");
      const errorMessage =
        error.response?.data?.message || "Error al registrar a la mascota";
      setError(errorMessage);
      throw error; // Re-lanzar el error para manejarlo en el componente
    } finally {
      setLoading(false);
    }
  };

  const clearSuccess = () => setSuccess(null); // Función para limpiar el éxito

  const fetchAllPets = async () => {
    try {
      setLoading(true);
      const response = await getAllPets();
      if (Array.isArray(response.data)) {
        setPets(response.data);
      } else if (response.data) {
        // Si la respuesta no es un array pero existe, la convertimos en array
        setPets([response.data]);
      } else {
        // Si no hay datos, establecemos un array vacío
        setPets([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener las mascotas");
      setPets([]); // Establecer array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const updatePetData = async (id, petData) => {
    try {
      setLoading(true);
      const response = await updatePet(id, petData);
      setSelectedPet(response.data);
      await fetchAllPets(); // Actualizar la lista después de la modificación
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Error al actualizar la mascota");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const removePet = async (id) => {
    try {
      setLoading(true);
      await deletePet(id);
      await fetchAllPets();
    } catch (err) {
      setError(err.response?.data?.message || "Error al borrar a la mascota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PetContext.Provider
      value={{
        pets: pets || [], // Asegurar que siempre sea un array
        selectedPet,
        loading,
        error,
        fetchPetById,
        fetchAllPets,
        updatePetData,
        removePet,
        registerPet,
        clearError,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};
