import React, { createContext, useContext, useState } from "react";
import { getAllCvs, getCvById, createCv, updateCv, deleteCv } from "../api/cv";

// Crear el contexto
const CvContext = createContext();

// Hook personalizado para usar el contexto
export const useCv = () => useContext(CvContext);

// Proveedor del contexto
export const CvProvider = ({ children }) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener todos los CVs
  const fetchCVs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllCvs();
      setCvs(data);
      return data;
    } catch (err) {
      console.error("Error al obtener los CVs:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener un CV por ID
  const fetchCvById = async (cvId) => {
    try {
      const { data } = await getCvById(cvId);
      return data;
    } catch (err) {
      console.error(`Error al obtener el CV con ID ${cvId}:`, err);
      setError(err.message);
      return null;
    }
  };

  // Función para crear un nuevo CV
  const addCV = async (cv) => {
    try {
      const { data } = await createCv(cv);
      setCvs((prevCvs) => [...prevCvs, data]);
      return data;
    } catch (err) {
      console.error("Error al crear el CV:", err);
      setError(err.message);
      throw err;
    }
  };

  // Función para editar un CV
  const editCV = async (cvId, cvData) => {
    try {
      const { data } = await updateCv(cvId, cvData);
      setCvs((prevCvs) =>
        prevCvs.map((cv) => (cv.cvId === cvId ? { ...cv, ...data } : cv)),
      );
      return data;
    } catch (err) {
      console.error("Error al actualizar el CV:", err);
      setError(err.message);
      throw err;
    }
  };

  // Función para eliminar un CV por ID
  const removeCV = async (cvId) => {
    try {
      await deleteCv(cvId);
      setCvs((prevCvs) => prevCvs.filter((cv) => cv.cvId !== cvId));
    } catch (err) {
      console.error(`Error al eliminar el CV con ID ${cvId}:`, err);
      setError(err.message);
      throw err;
    }
  };

  // Valor proporcionado por el contexto
  const value = {
    cvs,
    loading,
    error,
    fetchCVs,
    fetchCvById,
    addCV,
    editCV,
    removeCV,
  };

  return <CvContext.Provider value={value}>{children}</CvContext.Provider>;
};
