import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const recommendShelter = async (
  lat,
  lng
) => {
  const response = await API.post(
    "/shelters/recommend",
    {
      lat,
      lng,
    }
  );

  return response.data;
};