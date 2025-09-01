
// const baseURL = process.env.NODE_ENV === 'development'
//   ? 'http://localhost:3001'
//   : 'https://web-production-aa784.up.railway.app';

const baseURL = process.env.REACT_APP_API_URL;
console.log(baseURL);


export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,

    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};
