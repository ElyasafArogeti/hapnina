// client/src/axiosInstance.js

import axios from 'axios';

const baseURL =  process.env.NODE_ENV === 'production'
    ? 'http://localhost:3001'
    : 'https://web-production-aa784.up.railway.app'; // כתובת Railway שלך

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // אם אתה שולח cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
