import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';
import axios from 'axios';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const NewsService = {
  async addNews(payload) {
    const response = await Client.post('/news', payload);
    return response.data;
  },
  async deleteNews(id) {
    const response = await Client.delete(`/news/${id}`);
    return response;
  },
  async editNews(id, payload) {
    const response = await Client.patch(`/news/${id}`, payload);
    return response.data;
  },
  async getList(params) {
    const response = await Client.get('/news', { params });
    return response.data;
  },
  async getOne(id) {
    const response = await Client.get(`/news/${id}`);
    return response.data;
  },
};

export default NewsService;
