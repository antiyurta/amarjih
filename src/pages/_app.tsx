import { FC, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import Loader from '@components/common/loader';

import { SocketContext, socket } from '@context/socket';
import { ManagedUIContext } from '@context/uiContext';
import { AuthProvider } from '@context/auth';

import 'antd/dist/antd.css';
import '@styles/chrome-bug.scss';
import '@styles/main.scss';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp: FC<AppProps> = ({ Component, router, pageProps }: AppProps) => {
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);

  return (
    <>
      {pageLoading && <Loader />}
      <ManagedUIContext>
        <AuthProvider>
          <SocketContext.Provider value={socket}>
            <Component {...pageProps} />
          </SocketContext.Provider>
        </AuthProvider>
      </ManagedUIContext>
    </>
  );
};

export default MyApp;
