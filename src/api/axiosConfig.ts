import axios from "axios";
import { config } from "./config/config";

const env = process.env.NODE_ENV || "development";

let baseUrl = "";
if (env === "development") {
  baseUrl = process.env.REACT_APP_API_BASE_URL || "";
  // axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
  axios.defaults.headers.post["Content-Type"] =
    "application/json;charset=utf-8";
  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
}
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((req) => {
  return req;
});

export default api;
