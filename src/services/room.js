import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';
import axios from 'axios';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const RoomService = {
  async addRoom(payload) {
    const response = await Client.post('/rooms', payload);
    return response;
  },
  async deleteRoom(payload) {
    const response = await Client.delete(`/rooms/${payload}`);
    return response;
  },
  async getList(params) {
    const response = await Client.get('/rooms', { params });
    return response.data;
  },
};

export default RoomService;
