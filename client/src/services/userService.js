import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export const getResponders = async (token) => {
  const response = await API.get("/users/responders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
