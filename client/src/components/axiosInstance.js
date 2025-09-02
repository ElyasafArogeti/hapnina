
import axios from 'axios';

const baseURL =  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://web-production-aa784.up.railway.app'; // כתובת Railway שלך

// const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL,

  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
