import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Form, Result } from 'antd';

// context
import { useAuthState } from '@context/auth';

// components
import Alert from '@components/common/alert';
import TextField from '@components/common/TextField';

// services
import AuthService from '@services/auth';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const Forgot = () => {
  const router = useRouter();
  const { setLogin, isAuthenticated, user } = useAuthState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [requestStatus, setStatus] = useState(false);
  const [errors, setInputErrors] = useState({
    show: false,
    name: false,
    password: false,
  });

  const handleEmailChange = async e => {
    setEmail(e);
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
    console.log(values, email);
    let isError = false;
    if (email.length === 0) {
      isError = true;
      setInputErrors(prevState => ({
        show: true,
        ...prevState,
        name: true,
      }));
    }

    if (isError) return;

    try {
      const res: loginResponse = await AuthService.forgotPassword({
        email,
      });
      if (res && res.success) {
        console.log(res);
        setStatus(true);
        setEmail('');
        // await AuthTokenStorageService.store(res?.response?.accessToken);
        // await setLogin(res?.response?.accessToken);
        // await setLoginError(null);
        // router.push('/surgery');
        // openNotification();
      } else {
        setLoginError('error');
      }
    } catch (e) {
      setLoginError('error');
    }
  };

  return (
    <Layout>
      <div className="h-screen flex justify-center items-center bg-login-image bg-cover bg-center">
        {requestStatus ? (
          <div className="bg-white align-middle p-1 rounded-md">
            <Result
              status="success"
              title="Нууц үг сэргээх хүсэлт амжилттай илгээгдлээ!"
              subTitle="Та өөрийн бүртгэлтэй имэйл хаягаа шалгана уу."
              extra={[
                <div className="text-center my-2 font-xs text-gray">
                  <a href="/" className="no-underline hover:underline ...">
                    Буцах
                  </a>
                </div>,
              ]}
            />
          </div>
        ) : (
          <div className="bg-white align-middle p-12 rounded-md">
            <div className="text-2xl font-2xl">Нууц үг сэргээх</div>
            <Form name="login" onFinish={handleLogin}>
              <br />
              {loginError && (
                <div className="mb-3 mt-4 w-64">
                  <Alert
                    type="error"
                    message="Алдаа гарлаа"
                    description="Имэйл хаяг бүртгэлгүй байна."
                  />
                </div>
              )}
              <div className="mb-5">
                <div className="mb-3 mt-4 w-56">
                  <TextField
                    width="w-64"
                    label="Имэйл хаяг"
                    value={email}
                    error={errors.name}
                    errorMessage="Имэйл хаягаа оруулна уу!"
                    onChange={handleEmailChange}
                  />
                </div>
                <br />
                <button className="w-64 bg-button hover:bg-blue-700 text-white font-bold py-1 px-4 border border-blue-700 rounded">
                  Илгээх
                </button>
                <div className="text-center my-2 font-xs text-gray">
                  <a href="/" className="no-underline hover:underline ...">
                    Буцах
                  </a>
                </div>
              </div>
            </Form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Forgot;
