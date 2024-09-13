import axios from 'axios';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const token = AuthTokenStorageService.getAccessToken();

const uploadClient = axios.create({
  baseURL: process.env.BASE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: token ? `Bearer ${token}` : '',
    'X-API-KEY': process.env.X_API_KEY,
  },
});

export default uploadClient;
