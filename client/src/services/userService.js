import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getResponders = async (token) => {
  const response = await API.get("/users/responders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
