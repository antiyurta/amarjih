import cookie from 'js-cookie';

const AuthTokenStorageService = {
  store(accessToken: string) {
    cookie.set('access-token', accessToken, { expires: 86400 });
  },

  getAccessToken() {
    return cookie.get('access-token');
  },

  clear() {
    cookie.remove('access-token');
  },
};

export default AuthTokenStorageService;
