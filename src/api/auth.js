import instance from "./axiosInstance";

export const registerRequest = (user) => instance.post("/auth/register", user);
export const loginRequest = (user) => instance.post("/auth/login", user);
export const logoutRequest = () => instance.post("/auth/logout");
export const verifyTokenRequest = () => instance.get("/auth/verify-token");
