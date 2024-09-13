import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';
import axios from 'axios';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const StructureService = {
  async addStructure(payload) {
    const response = await Client.post('/companyStructure', payload);
    return response;
  },
  async editStructure(id, payload) {
    const response = await Client.patch(`/companyStructure/${id}`, payload);
    return response.data;
  },
  async deleteStructure(payload) {
    const response = await Client.delete(`/companyStructure/${payload}`);
    return response;
  },
  async getOne(id) {
    const response = await Client.get(`/companyStructure/${id}`);
    return response.data;
  },
  async getList(query) {
    const response = await Client.get(`/companyStructure${query}`);
    return response.data;
  },
};

export default StructureService;
