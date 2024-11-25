import instance from "./axiosInstance";

export const getUserById = (id) => instance.get(`/users/${id}`);
export const getAllUsers = () => instance.get("/users");
export const updateUser = (id, user) => instance.put(`/users/${id}`, user);
export const deleteUser = (id) => instance.delete(`/users/${id}`);
export const activateUser = (id) => instance.get(`/users/activate/${id}`);
