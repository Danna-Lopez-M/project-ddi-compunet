import axios from "./axios";

export const getMedicalHistoryByPetId = (petId) =>
  axios.get(`/medical-history/${petId}`);

export const getTreatmentsByAppointmentId = (appointmentId) =>
  axios.get(`/medical-history/treatments/${appointmentId}`);
