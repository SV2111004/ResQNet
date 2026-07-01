import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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

export const getShelters = async () => {
  const response = await API.get(
    "/shelters"
  );

  return response.data;
};

export const updateOccupancy = async (
  shelterId,
  people
) => {
  const response = await API.put(
    `/shelters/${shelterId}/occupancy`,
    {
      people,
    }
  );

  return response.data;
};