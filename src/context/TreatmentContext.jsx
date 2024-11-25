import React, { createContext, useContext, useState } from "react";
import {
  getAllTreatments,
  getTreatmentById,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} from "../api/treatment";

const TreatmentContext = createContext();

export const useTreatments = () => {
  const context = useContext(TreatmentContext);
  if (!context) {
    throw new Error("useTreatments must be used within a TreatmentProvider");
  }
  return context;
};

export const TreatmentProvider = ({ children }) => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los tratamientos
  const fetchTreatments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTreatments();
      console.log(
        "Datos de tratamientos recibidos en el context:",
        response.data,
      );
      setTreatments(response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching treatments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un tratamiento por ID
  const fetchTreatmentById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTreatmentById(id);
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error("Error fetching treatment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Añadir un nuevo tratamiento
  const addTreatment = async (newTreatment) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createTreatment(newTreatment);
      setTreatments([...treatments, response.data]);
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error("Error adding treatment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Editar un tratamiento existente
  const editTreatment = async (id, updatedTreatment) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateTreatment(id, updatedTreatment);
      setTreatments(
        treatments.map((treatment) =>
          treatment.idTrataments === id ? response.data : treatment,
        ),
      );
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error("Error updating treatment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un tratamiento
  const removeTreatment = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTreatment(id);
      setTreatments(
        treatments.filter((treatment) => treatment.idTrataments !== id),
      );
    } catch (error) {
      setError(error.message);
      console.error("Error removing treatment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    treatments,
    loading,
    error,
    fetchTreatments,
    fetchTreatmentById,
    addTreatment,
    editTreatment,
    removeTreatment,
  };

  return (
    <TreatmentContext.Provider value={value}>
      {children}
    </TreatmentContext.Provider>
  );
};

export default TreatmentContext;
