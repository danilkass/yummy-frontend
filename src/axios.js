import axios from "axios";
import { API_ROUTE, SERVER_URL } from "./utils/const";

const instance = axios.create({
  baseURL: SERVER_URL + API_ROUTE,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + window.localStorage.getItem("token");

  return config;
});

export default instance;
