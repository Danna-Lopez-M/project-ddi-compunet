import { createContext, useContext, useState } from "react";
import {
  getAppointmentById,
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../api/appointment";

export const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointment debe ser usado dentro de un AppointmentProvider",
    );
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointmentById = async (id) => {
    try {
      setLoading(true);
      const response = await getAppointmentById(id);
      setSelectedAppointment(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener la cita");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAllAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener las citas");
    } finally {
      setLoading(false);
    }
  };

  const createNewAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      await createAppointment(appointmentData);
      await fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la cita");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentData = async (id, appointmentData) => {
    try {
      setLoading(true);
      await updateAppointment(id, appointmentData);
      await fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar la cita");
    } finally {
      setLoading(false);
    }
  };

  const removeAppointment = async (id) => {
    try {
      setLoading(true);
      await deleteAppointment(id);
      setAppointments(appointments.filter((app) => app.idAppointment !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        selectedAppointment,
        loading,
        error,
        fetchAppointmentById,
        fetchAppointments,
        createNewAppointment,
        updateAppointmentData,
        removeAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
