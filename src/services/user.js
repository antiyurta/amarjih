import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';
import UploadClient from '@lib/uploadClient';
// import axios from 'axios';
// import AuthTokenStorageService from '@services/AuthTokenStorageService';

const UserService = {
  async addUser(payload) {
    const response = await Client.post('/authentication/register/', payload);
    return response.data;
  },
  async editUser(id, payload) {
    const response = await Client.patch(`/users/${id}`, payload);
    return response.data;
  },
  async editMyProfile(payload) {
    const response = await Client.post(`/users/profile`, payload);
    return response.data;
  },
  async getList(query) {
    const response = await Client.get(`/users${query}`);
    return response.data;
  },
  async getOne(id) {
    const response = await Client.get(`/users/${id}`);
    return response.data;
  },
  async uploadFile(payload) {
    const response = await UploadClient.post('/users/avatar/', payload);
    return response;
  },
  async deleteUser(id) {
    const response = await UploadClient.delete(`/users/${id}`);
    return response.data;
  },
};

export default UserService;
