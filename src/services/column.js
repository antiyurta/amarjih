import Client from '@lib/apiClient';

const ColumnService = {
  async getList(params) {
    const response = await Client.get('/column', { params });
    return response.data;
  },
  async getParentList(id) {
    const response = await Client.get('/column/current/' + id);
    return response.data;
  },
};

export default ColumnService;
