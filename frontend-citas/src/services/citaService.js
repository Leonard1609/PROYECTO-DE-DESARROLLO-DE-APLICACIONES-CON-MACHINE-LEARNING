import axios from 'axios';

const API_URL = 'http://localhost:5000/api/citas';

export const citaService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  updateStatus: async (id, estado, datosExtra = {}) => {
    const response = await axios.put(`${API_URL}/${id}`, { estado, ...datosExtra });
    return response.data;
  }
};