
const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://api.cateringhapnina.co.il';

export const apiFetch = async (endpoint, options = {}) => {
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(`${baseURL}${normalizedEndpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();

  console.log('API URL:', `${baseURL}${normalizedEndpoint}`);
  console.log('API Status:', response.status);
  console.log('API Content-Type:', contentType);
  console.log('API Response:', body.slice(0, 500));

  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${body.slice(0, 200)}`);
  }

  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON but received: ${contentType}. Response: ${body.slice(0, 200)}`);
  }

  return JSON.parse(body);
};
