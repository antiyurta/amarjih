import axios from 'axios';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

// const token = AuthTokenStorageService.getAccessToken();

const getToken = () => {
  return AuthTokenStorageService.getAccessToken();
};

let apiClient = axios.create({
  baseURL: process.env.BASE_API_URL,
  headers: {
    'Content-type': 'application/json',
    Authorization: '',
    'X-API-KEY': process.env.X_API_KEY,
  },
});

apiClient.interceptors.request.use(function (config) {
  const token = getToken();
  config.headers.Authorization = token ? `Bearer ${token}` : '';

  return config;
});

export default apiClient;
