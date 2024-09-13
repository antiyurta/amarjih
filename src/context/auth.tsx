import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '@services/auth';
import isEmpty from '@utils/isEmpty';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

export interface AuthContextData {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  setLogin: (token: string) => void;
  setLogout: () => void;
}

export const authContextDefaultValue: AuthContextData = {
  isAuthenticated: false,
  user: null,
  loading: true,
  setLogin: () => null,
  setLogout: () => null,
};

export const AuthStateContext = createContext<AuthContextData>(authContextDefaultValue);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const authToken =
        AuthTokenStorageService.getAccessToken() &&
        AuthTokenStorageService.getAccessToken() != 'false'
          ? AuthTokenStorageService.getAccessToken()
          : '';
      if (authToken) {
        try {
          const res = await AuthService.getCurrentUser(authToken);
          if (res && res?.status === 200) {
            if (!isEmpty(res?.data)) {
              await setUser(res?.data);
            }
          } else {
            return null;
          }
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const setLogin = async (token: string) => {
    try {
      interface Response {
        data: any;
        // response: any;
      }
      const result: Response = await AuthService.getCurrentUser(token);
      if (result && result?.data.success) {
        await setUser(result?.data);
      } else {
        return null;
      }
    } catch (err) {
      // noop
      console.log('Login hiihed aldaa garlaa');
    }
  };

  const setLogout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthStateContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        setLogin,
        setLogout,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
