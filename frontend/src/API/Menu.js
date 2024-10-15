import React from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";


export const getMenu = () => {
  return axios.get(`${API_URL}/menu`);
};

export const getMenuById = (id) => {
  return axios.get(`${API_URL}/menu/${id}`);
};

export const updateMenu = (id, formData) => {
  return axios.put(`${API_URL}/menu/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteMenu = (id) => {
  console.log(id)
  return axios.delete(`${API_URL}/menu/${id}`);
};