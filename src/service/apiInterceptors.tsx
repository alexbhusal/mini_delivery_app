import axios from "axios";
import { tokenStorage } from "../store/storage";
import { logout } from "./authService";
import { BASE_URL } from "./config";

export const refresh_tokens = async () => {
  try {
    const refreshToken = await tokenStorage.getItem("refresh_token");
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refresh_token: refreshToken,
    });

    const new_access_token = response.data.access_token;
    const new_refresh_token = response.data.refresh_token;

    tokenStorage.setItem("access_token", new_access_token);
    tokenStorage.setItem("refresh_token", new_refresh_token);
    return new_access_token;
  } catch (error) {
    console.log("RefreshToken Error", error);
    tokenStorage.removeItem("access_token");
    tokenStorage.removeItem("refresh_token");
    logout();
  }
};

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

appAxios.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

appAxios.interceptors.request.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refresh_tokens();
        if (newAccessToken) {
          error.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        }
      } catch (error) {
        console.log("Error refresh token", error);
      }
    }
  },
);
