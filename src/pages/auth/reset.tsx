import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Form, message } from 'antd';
import Image from 'next/image';

// context
import { useAuthState } from '@context/auth';

// components
import Alert from '@components/common/alert';
import TextField from '@components/common/TextField';

// services
import AuthService from '@services/auth';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const ResetPass = () => {
  const router = useRouter();
  const { setLogin, isAuthenticated, user } = useAuthState();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [errors, setInputErrors] = useState({
    show: false,
    name: false,
    password: false,
  });

  const handlePassword2Change = async e => {
    setPassword2(e);
  };

  const handlePasswordChange = async e => {
    setPassword(e);
  };

  interface responseObj {
    accessToken?: string;
    refreshToken?: string;
  }

  interface loginResponse {
    response?: responseObj;
    success?: boolean;
    message?: string;
  }

  const handleLogin = async values => {
    let isError = false;
    if (password !== password2) {
      setLoginError('Нууц үгийн баталгаа буруу байна.');
      return;
    }
    if (password2.length === 0) {
      isError = true;
      setInputErrors(prevState => ({
        show: true,
        ...prevState,
        name: true,
      }));
    }
    if (password.length === 0) {
      isError = true;
      setInputErrors(prevState => ({
        show: true,
        ...prevState,
        password: true,
      }));
    }

    if (isError) return;

    try {
      console.log(router.query.token);
      const res: loginResponse = await AuthService.changePassword({
        password,
        password2,
        token: router.query.token,
      });
      if (res && res.success) {
        // await AuthTokenStorageService.store(res?.response?.accessToken);
        // await setLogin(res?.response?.accessToken);
        setLoginError(null);
        message.success('Таны нууц үг амжилттай солигдлоо.');
        router.push('/');
      } else {
        setLoginError('Нууц үг хэтэрхий энгийн байна');
      }
    } catch (e) {
      setLoginError('Нууц үг хэтэрхий энгийн байна');
    }
  };

  return (
    <Layout>
      <div className="h-screen flex justify-center items-center bg-login-image bg-cover bg-center">
        <div className="bg-white align-middle p-12 rounded-md">
          <div className="text-2xl font-2xl">Нууц үг үүсгэх</div>
          <Form name="login" onFinish={handleLogin} className="space-y-4">
            <br />
            {loginError && (
              <div className="mb-3 mt-4 w-64">
                <Alert
                  type="error"
                  message="Алдаа гарлаа"
                  description={loginError}
                />
              </div>
            )}
            <div className="mb-5">
              <div className="mb-3 mt-4 w-56">
                <TextField
                  width="w-64"
                  label="Шинэ нууц үг"
                  type="password"
                  value={password}
                  error={errors.password}
                  errorMessage="Нууц үгээ оруулна уу!"
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mb-1 w-56">
                <TextField
                  width="w-64"
                  label="Нууц үг давтах"
                  type="password"
                  value={password2}
                  error={errors.name}
                  errorMessage="Нэвтрэх нэрээ оруулна уу!"
                  onChange={handlePassword2Change}
                />
              </div>
              <br />
              <button className="w-64 bg-button hover:bg-blue-700 text-white font-bold py-1 px-4 border border-blue-700 rounded">
                Хадгалах
              </button>
              <div className="text-center my-2 font-xs text-gray">
                <a href="/" className="no-underline hover:underline ...">
                  Буцах
                </a>
                <span></span>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPass;
