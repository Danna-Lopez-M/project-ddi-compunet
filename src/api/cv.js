import instance from "./axiosInstance";

// Obtener todos los CVs
export const getAllCvs = () => instance.get("/api/cvs");

// Obtener un CV por ID
export const getCvById = (cvId) => instance.get(`/api/cvs/${cvId}`);

// Crear un nuevo CV
export const createCv = (cv) => instance.post("/api/cvs", cv);

// Actualizar un CV por ID
export const updateCv = (cvId, cvData) =>
  instance.put(`/api/cvs/${cvId}`, cvData);

// Eliminar un CV por ID
export const deleteCv = (cvId) => instance.delete(`/api/cvs/${cvId}`);
