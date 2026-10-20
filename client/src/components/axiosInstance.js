
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.cateringhapnina.co.il',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
