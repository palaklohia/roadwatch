import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export const getComplaints = () => API.get("/api/complaints");
export const getWorstRoads = () => API.get("/api/repeat-offenders/roads");
export const getWorstContractors = () => API.get("/api/repeat-offenders/contractors");
export const getBudgetData = () => API.get("/api/infrastructure/budget");
export const getComplaintById = (id) => API.get(`/api/complaints/${id}`);