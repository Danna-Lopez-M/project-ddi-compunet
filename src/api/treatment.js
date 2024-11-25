import instance from "./axios";

// Obtener todos los tratamientos
export const getAllTreatments = () => instance.get("/api/treatments");

// Obtener un tratamiento por ID
export const getTreatmentById = (treatmentId) =>
  instance.get(`/api/treatments/${treatmentId}`);

// Crear un nuevo tratamiento
export const createTreatment = (treatment) =>
  instance.post("/api/treatments", treatment);

// Actualizar un tratamiento existente
export const updateTreatment = (treatmentId, treatment) =>
  instance.put(`/api/treatments/${treatmentId}`, treatment);

// Eliminar un tratamiento por ID
export const deleteTreatment = (treatmentId) =>
  instance.delete(`/api/treatments/${treatmentId}`);
