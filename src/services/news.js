import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';
import axios from 'axios';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const NewsService = {
  async addNews(payload) {
    const response = await Client.post('/news', payload);
    return response;
  },
  async deleteNews(id) {
    const response = await Client.delete(`/news/${id}`);
    return response;
  },
  async getList(query) {
    const response = await Client.get('/news', query);
    return response.data;
  },
};

export default NewsService;
