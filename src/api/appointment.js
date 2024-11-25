import axios from "./axios";

export const getAppointmentById = (id) => axios.get(`/appointments/${id}`);
export const getAllAppointments = () => axios.get("/appointments");
export const updateAppointment = (id, appointment) =>
  axios.put(`/appointments/${id}`, appointment);
export const deleteAppointment = (id) => axios.delete(`/appointments/${id}`);
export const createAppointment = (appointment) =>
  axios.post(`/appointments`, appointment);
