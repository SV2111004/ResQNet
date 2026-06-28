import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getEmergencies = async (
  token
) => {

  const response =
    await API.get(
      "/emergencies",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

export const createEmergency = async (
  emergencyData,
  token
) => {

  const response =
    await API.post(
      "/emergencies",
      emergencyData,
      {
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

export const getEmergencyStats =
async (token) => {

  const response =
    await API.get(
      "/emergencies/stats",
      {
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

export const assignShelter = async (
  emergencyId,
  shelterId,
  token
) => {

  const response =
    await API.put(
      `/emergencies/${emergencyId}/assign-shelter`,
      {
        shelterId,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};