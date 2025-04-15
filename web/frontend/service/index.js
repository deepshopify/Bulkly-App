import axios from "axios";
import { API_URL } from "../utils/config";

export const backendAPI = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};