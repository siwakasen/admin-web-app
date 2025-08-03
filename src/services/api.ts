import axios from "axios";

const defaultBaseURL = "http://localhost:3003";

const createApiInstance = async (baseURL?: string, token?: string) => {
  const api = axios.create({
    baseURL: baseURL || defaultBaseURL, // Gunakan baseURL custom atau default
    timeout: 10000, // Timeout 10 detik
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  api.interceptors.response.use((response) => {
    return response;
  });
  return api;
};

export { createApiInstance };
