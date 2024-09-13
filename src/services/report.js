import Client from '@lib/apiClient';

const ReportService = {
  async getDepList(query) {
    const response = await Client.get(`/report/departure${query}`);
    return response;
  },
  async getUserList(query) {
    const response = await Client.get(`/report/duty${query}`);
    return response;
  },
  async getOneUserRolesCount(id, query) {
    const response = await Client.get(`/report/users/${id}/duty${query}`);
    return response.data;
  },
  async getDiagnoseCount(query) {
    const response = await Client.get(`/report/diagnose${query}`);
    return response;
  },
  async getDiagnoseCountAges(query) {
    const response = await Client.get(`/report/diagnose/ages/${query}`);
    return response;
  },
  async getSurgeryCountAges(query) {
    const response = await Client.get(`/report/surgery/ages/${query}`);
    return response;
  },
  async getTaskCount(query) {
    const response = await Client.get(`/report/task${query}`);
    return response;
  },
  async getCancelTaskCount(query) {
    const response = await Client.get(`/report/task/cancel${query}`);
    return response;
  },
  async getRoomTaskCount(query) {
    const response = await Client.get(`/rooms/dashboard${query}`);
    return response;
  },
  async getTopUser(query) {
    const response = await Client.get(`/report/topuser${query}`);
    return response;
  },
};

export default ReportService;
