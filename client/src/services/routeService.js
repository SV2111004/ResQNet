import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export const optimizeRoute = async (start, end) => {
  const response = await API.post("/routes/optimize", {
    start,
    end,
  });

  return response.data;
};
