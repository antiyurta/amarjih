import React, { useState } from 'react';
import { useRouter } from 'next/router';

import MainLayout from '@components/layout/main';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <div className={`p-2 mb-3 flex justify-center items-center h-screen`}>
        <div className="text-2xl">Хуудас олдсонгүй</div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
