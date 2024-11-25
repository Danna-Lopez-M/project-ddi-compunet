import instance from "./axiosInstance";

export const getAllRoles = () => instance.get("/api/roles");
export const createRole = (role) => instance.post("/api/roles", role);
// export const assignRoleToUser = (userId, roleId) =>
//   instance.post(`/api/roles/assign?userId=${userId}&roleId=${roleId}`);
export const deleteRole = (roleId) => instance.delete(`/api/roles/${roleId}`);
// export const removeRoleFromUser = (userId, roleId) =>
//   instance.delete(`/api/roles/remove?userId=${userId}&roleId=${roleId}`);
export const updateRole = async (roleId, roleData) => {
  return await instance.put(`/api/roles/${roleId}`, roleData);
};
