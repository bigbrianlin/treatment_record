import axios from "axios";
import AuthService from "./auth.service";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/api/auth/refresh", {
          withCredentials: true,
        });

        const newToken = res.data.token;
        AuthService.updateToken(newToken);

        originalRequest.headers.Authorization = newToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");
        AuthService.logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
