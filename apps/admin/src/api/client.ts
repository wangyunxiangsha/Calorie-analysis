import axios from 'axios';

const client = axios.create({
  baseURL: '/api/v1',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => Promise.reject(err.response?.data?.error ?? err),
);

export default client;
