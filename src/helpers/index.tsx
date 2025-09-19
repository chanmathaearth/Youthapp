import axiosInstance from "../helpers/axiosInstance"

export const getAll = async (url: string) => {
  const response = await axiosInstance.get(`${url}/`);
  return response.data;
};

export const getById = async (url: string, id: string | number) => {
  const response = await axiosInstance.get(`${url}/${id}/`);
  return response.data;
};

export const create = async (url: string, record: any) => {
  const response = await axiosInstance.post(`${url}/`, record);
  return response.data;
};

export const updateById = async (url: string, id: string | number, record: any) => {
  const response = await axiosInstance.patch(`${url}/${id}/`, record);
  return response.data;
};

export const deleteById = async (url: string, id: string | number) => {
  const response = await axiosInstance.delete(`${url}/${id}/`);
  return response.data;
};

export const postBody = async (url: string, record: any) => {
  const response = await axiosInstance.post(`${url}/`, record);
  return response.data;
};
