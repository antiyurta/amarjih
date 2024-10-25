import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Form } from 'antd';
import Image from 'next/image';

// context
import withAuth from '@hooks/hoc';
import { useAuthState } from '@context/auth';

// components
import Alert from '@components/common/alert';
import TextField from '@components/common/TextField';
import Button from '@components/common/button';

// services
import AuthService from '@services/auth';
import AuthTokenStorageService from '@services/AuthTokenStorageService';

const Index = () => {
  const router = useRouter();
  const { setLogin, isAuthenticated, user } = useAuthState();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [isShown, setIsSHown] = useState(false);

  // This function is called when the checkbox is checked or unchecked
  const togglePassword = () => {
    setIsSHown(isShown => !isShown);
  };
  const [errors, setInputErrors] = useState({
    show: false,
    name: false,
    password: false,
  });

  const handlePhoneChange = async e => {
    setPhone(e);
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
    if (phone.length === 0) {
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
      setButtonLoader(true);
      const res: loginResponse = await AuthService.authenticate({
        phone,
        password,
      });
      if (res && res.success) {
        await AuthTokenStorageService.store(res?.response?.accessToken);
        await setLogin(res?.response?.accessToken);
        setLoginError(null);
      } else {
        setButtonLoader(false);
        setLoginError('error');
      }
    } catch (e) {
      setButtonLoader(false);
      setLoginError('error');
    }
  };

  useEffect(() => {
    if (user) {
      if (user?.response?.role == 'admin' || user?.response?.role == 'nurse') {
        router.push('tasks');
        return;
      } else {
        router.push('/news');
      }
    }
  }, [user]);
  return (
    <Layout>
      <div className="h-screen flex justify-center items-center bg-login-image bg-cover bg-center">
        <div className="bg-white align-middle p-12 rounded-md">
          <Form name="login" onFinish={handleLogin} className="space-y-4">
            <br />
            {loginError && (
              <div className="mb-3 mt-4 w-64">
                <Alert
                  type="error"
                  message="Алдаа гарлаа"
                  description="Нэвтрэх нэр эсвэл нууц үг буруу байна"
                  onClose={() => setLoginError(null)}
                />
              </div>
            )}
            <div className="mb-5">
              <div className="flex justify-center mb-2">
                <Image src={`/assets/icon.png`} alt="avatar" width={70} height={56} />
              </div>
              <div className="text-xs font-bold mt-2 text-secondary text-center">
                НИЙСЛЭЛИЙН АМГАЛАН АМАРЖИХ ГАЗАР
              </div>
              <div className="mb-3 mt-4 w-56">
                <TextField
                  width="w-64"
                  label="Нэвтрэх нэр"
                  value={phone}
                  name="phone"
                  error={errors.name}
                  errorMessage="Нэвтрэх нэрээ оруулна уу!"
                  onChange={handlePhoneChange}
                />
              </div>
              <div className="w-56 mb-4">
                <TextField
                  width="w-64"
                  label="Нууц үг"
                  type={isShown ? 'text' : 'password'}
                  name="password"
                  value={password}
                  error={errors.password}
                  errorMessage="Нууц үгээ оруулна уу!"
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="w-56 mb-4">
                <label htmlFor="checkbox">Show password? </label>
                <input id="checkbox" type="checkbox" checked={isShown} onChange={togglePassword} />
              </div>
              <div className="w-64">
                {buttonLoader ? (
                  <Button color="loader" name="loading" />
                ) : (
                  <button
                    color="loader"
                    type="submit"
                    className="w-full h-[2.2rem] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-bold rounded px-4 py-2 text-sm text-center inline-flex items-center justify-center"
                  >
                    Нэвтрэх
                  </button>
                )}
              </div>
              <div className="text-center my-2 font-xs text-gray">
                <a href="auth/forgot" className="no-underline hover:underline ...">
                  Нууц үгээ мартсан уу?
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

export async function getServerSideProps({ req, res }) {
  if (req.headers.cookie) {
    const accessToken = req.headers.cookie.split('=')[1];
    if (accessToken) {
      try {
        await AuthService.getCurrentUser(accessToken);
        return {
          redirect: {
            permanent: false,
            destination: '/tasks',
          },
        };
      } catch (e) {
        console.log(e);
        res.setHeader('access-token', [
          `WebsiteToken=deleted; Max-Age=0`,
          `AnotherCookieName=deleted; Max-Age=0`,
        ]);
      }
    }
  }
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Index;
