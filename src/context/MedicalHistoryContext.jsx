import { createContext, useContext, useState } from "react";
import {
  getMedicalHistoryByPetId,
  getTreatmentsByAppointmentId,
} from "../api/medicalHistory";

export const MedicalHistoryContext = createContext();

export const useMedicalHistory = () => {
  const context = useContext(MedicalHistoryContext);
  if (!context) {
    throw new Error(
      "useMedicalHistory debe ser usado dentro de un MedicalHistoryProvider",
    );
  }
  return context;
};

export const MedicalHistoryProvider = ({ children }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedicalHistoryByPetId = async (petId) => {
    try {
      setLoading(true);
      const response = await getMedicalHistoryByPetId(petId);
      setMedicalHistory(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al obtener el historial médico",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatmentsByAppointmentId = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await getTreatmentsByAppointmentId(appointmentId);
      setTreatments(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al obtener los tratamientos",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MedicalHistoryContext.Provider
      value={{
        medicalHistory,
        treatments,
        loading,
        error,
        fetchMedicalHistoryByPetId,
        fetchTreatmentsByAppointmentId,
      }}
    >
      {children}
    </MedicalHistoryContext.Provider>
  );
};
