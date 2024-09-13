import Client from '@lib/apiClient';

const CustomerService = {
  async getOne(id) {
    const response = await Client.get(`/customers/${id}`);
    return response;
  },
  async getList(query) {
    const response = await Client.get(`/customers${query}`);
    return response.data;
  },
};

export default CustomerService;
