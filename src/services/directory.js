import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';
import axios from 'axios';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const DirectoryService = {
  async getList(query) {
    const response = await Client.get(`/directories${query}`);
    return response.data;
  },
  async getIcd10List(query) {
    const response = await Client.get(`/directories/icd/search${query}`);
    return response.data;
  },
  async addDirectory(payload) {
    const response = await Client.post('/directories', payload);
    return response.data;
  },
  async editDirectory(id, payload) {
    const response = await Client.patch(`/directories/${id}`, payload);
    return response.data;
  },
  async deleteDirectory(payload) {
    const response = await Client.delete(`/directories/${payload}`);
    return response.data;
  },
};

export default DirectoryService;
