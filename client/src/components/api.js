
const baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : 'https://web-production-aa784.up.railway.app';

  //אם רוצה מקומי אז שנה ל 'development'
export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    credentials: 'include', // אם אתה משתמש ב־cookies או sessions
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
