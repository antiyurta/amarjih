import Client from '@lib/apiClient';

const CompanyService = {
  async getMyComInfo() {
    const response = await Client.get('/companies/mycom');
    return response.data;
  },

  async getOne(id) {
    const response = await Client.get(`/companies/${id}`);
    return response;
  },
  async getList(id) {
    const response = await Client.get(`/companies/${id}`);
    return response.data;
  },
  async updateCompany(id, payload) {
    const response = await Client.patch(`/companies/${id}`, payload);
    return response.data;
  },
};

export default CompanyService;
