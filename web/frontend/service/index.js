import axios from "axios";
import { API_URL } from "../utils/config";

export const backendAPI = (contentType) => {
  return axios.create({
    baseURL: API_URL,
    headers: contentType && {
      'Content-Type': contentType
    }
  });
};