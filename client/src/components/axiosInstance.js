
import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://1ksadbt3.up.railway.app';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
