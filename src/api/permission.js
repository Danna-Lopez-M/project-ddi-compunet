import axios from "./axios";

export const getAllRolePermissions = () => axios.get("/roles-permissions");
export const updateRolePermission = (rolePermission) =>
  axios.put(`/roles-permissions`, rolePermission);
