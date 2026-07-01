import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export const createMission = async (data, token) => {
  const response = await API.post("/missions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyMissions =
async (token) => {

 const response =
 await API.get(
  "/missions/my",
  {
   headers:{
    Authorization:
    `Bearer ${token}`
   }
  }
 );

 return response.data;
};

export const acceptMission =
async (
  missionId,
  token
) => {

  const response =
    await API.put(
      `/missions/${missionId}/accept`,
      {},
      {
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

export const completeMission =
async (
  missionId,
  token
) => {

  const response =
    await API.put(
      `/missions/${missionId}/complete`,
      {},
      {
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      }
    );

  return response.data;
};
export const startNavigation = async (
  missionId,
  navigationData,
  token
) => {
  const response = await API.put(
    `/missions/${missionId}/start-navigation`,
    navigationData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const reachSite = async (missionId, token) => {
  const response = await API.put(
    `/missions/${missionId}/reach-site`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};