import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const optimizeRoute = async (start, end) => {
  const response = await API.post("/routes/optimize", {
    start,
    end,
  });

  return response.data;
};
