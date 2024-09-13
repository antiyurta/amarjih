/* eslint-disable react/display-name */
import React from 'react';
import Redirect from '../components/common/Redirect';
import { useAuthState } from '../context/auth';
import Loader from '@components/common/loader';

// import Loader from '@/components/loading/loader';
// import BaseLayout from '@/layouts/BaseLayout';
// import BasePage from '@/layouts/BasePage';

const withAuth = Component => {
  return props => {
    const { isAuthenticated, loading, user } = useAuthState();
    if (loading) {
      return <Loader />;
    }
    if (!isAuthenticated) {
      return <Redirect ssr to="/" />;
    }

    return <Component user={user} loading={loading} {...props} />;
  };
};

export default withAuth;
