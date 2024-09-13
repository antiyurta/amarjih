import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';

const TaskService = {
  async addTask(payload) {
    const response = await Client.post('/tasks/', payload);
    return response.data;
  },
  async editTask(id, payload) {
    const response = await Client.patch(`/tasks/${id}`, payload);
    return response.data;
  },
  async changeTaskPosition(payload) {
    const response = await Client.post(`/tasks/changePosition`, payload);
    return response.data;
  },
  async changeStatus(id, payload) {
    const response = await Client.put(`/tasks/changeStatus/${id}`, payload);
    return response.data;
  },
  async cancelTask(id, payload) {
    const response = await Client.put(`/tasks/cancel/${id}`, payload);
    return response.data;
  },
  async planTask(id, payload) {
    const response = await Client.put(`/tasks/plan/${id}`, payload);
    return response.data;
  },
  async allConfirmTask(payload) {
    const response = await Client.post(`/tasks/confirm/`, payload);
    return response.data;
  },
  async deleteTask(payload) {
    const response = await Client.delete(`/tasks/${payload}`);
    return response.data;
  },
  async getList(query, token) {
    const response = await Client.get(`/tasks${query}`);
    return response.data;
  },
  async getStatList() {
    const response = await Client.get(`/tasks/stat/dashboard`);
    return response;
  },
  async getOne(id) {
    const response = await Client.get(`/tasks/${id}`);
    return response.data;
  },
  async getRangeStatCounts() {
    const response = await Client.get(`/tasks/range`);
    return response.data;
  },
  async getRangeMonthStatCounts(query) {
    const response = await Client.get(`/tasks/month/range${query}`);
    return response.data;
  },
  async getRecentUsers(query) {
    const response = await Client.get(`/taskWorker/recentusers${query}`);
    return response.data;
  },

  async getRecentTaskUsers(query) {
    const response = await Client.get(`/tasks/recentusers${query}`);
    return response.data;
  },
};

export default TaskService;
