import axios from "./axios";

export const getPetById = (id) => axios.get(`api/pets/${id}`);
export const getAllPets = () => axios.get("api/pets");
export const updatePet = (id, pet) => axios.put(`api/pets/${id}`, pet);
export const deletePet = (id) => axios.delete(`api/pets/${id}`);
export const registerPetRequest = (pet) => axios.post(`api/pets`, pet);
