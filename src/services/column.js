import Client from '@lib/apiClient';

const ColumnService = {
  async getList(params) {
    const response = await Client.get('/column', { params });
    return response.data;
  },
};

export default ColumnService;
