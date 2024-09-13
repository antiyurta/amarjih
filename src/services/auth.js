import { isEmpty } from 'lodash';
import Client from '@lib/apiClient';
import axios from 'axios';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const AuthService = {
  async authenticate(payload) {
    const response = await Client.post('authentication/login/', payload);
    return response.data;
  },

  async getConfirmationCode(payload) {
    const response = await Client.post('/account/verify_code/phone/', payload);
    const datas = {
      status: response.data.status_code,
      result: response.data.result,
      message: response.data.message,
    };
    return datas;
  },

  async createNewPassword(payload) {
    const response = await Client.post('/account/forgot_password/', payload);
    const datas = {
      status: response.data.status_code,
      result: response.data.result,
      message: response.data.message,
    };
    return datas;
  },

  async forgotPassword(payload) {
    const response = await Client.post('/authentication/forgotPassword/', payload);

    return response.data;
  },

  async changePassword(payload) {
    const response = await Client.post('/authentication/changePassword/', payload);

    return response.data;
  },

  async getCurrentUser(token = '') {
    const response = await axios.get(`${process.env.BASE_API_URL}authentication`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : null,
        'X-API-KEY': process.env.X_API_KEY,
      },
    });

    return response;
  },

  async createUserCheck(payload) {
    const data = {
      phone: payload.phone,
      dial_code: payload.dialCode,
    };

    const response = await Client.post('/account/verification_code/phone/', data);
    return response?.data?.result;
  },

  async verifySms(payload) {
    const data = {
      phone: payload.phone,
      dial_code: payload.dialCode,
    };

    const response = await Client.post('/account/global_verification_code/phone/', data);
    const datas = {
      status: response.data.status_code,
      result: response.data.result,
      message: response.data.message,
    };
    return datas;
  },

  async emailSubscribe(email) {
    const response = await Client.post('/gandan/air/subscription/', {
      email: email,
    });
    return response;
  },

  async verifyCode(payload) {
    const data = {
      phone: payload.phone,
      dial_code: payload.dialCode,
      code: payload.code,
    };
    const response = await Client.post('/account/register/customer/', data);
    const datas = {
      status: response.data.status_code,
      result: response.data.result,
      message: response.data.message,
      token: response.data.result.token,
    };
    return datas;
  },

  async guestToken() {
    const response = await Client.post('/account/guest_jwt/');
    const guestToken = response.data.result.JWToken;
    return guestToken;
  },

  logout() {
    AuthTokenStorageService.clear();
  },

  isAuthenticated() {
    return !isEmpty(AuthTokenStorageService.getAccessToken());
  },
};

export default AuthService;
