import axios from "axios";

// Centralized API client. We'll add auth interceptors in later steps.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000",
  withCredentials: true,
  timeout: 20_000
});

