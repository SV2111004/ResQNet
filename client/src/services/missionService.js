import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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