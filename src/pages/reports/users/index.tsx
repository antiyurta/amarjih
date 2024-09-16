import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import withAuth from '@hooks/hoc';

// components
import MoreLayout from '@components/layout/more';
import UserReport from '@components/report/userReport';
import DepReport from '@components/report/depReport';
import DiagnoseReport from '@components/report/diagnoseReport';
import TaskReport from '@components/report/taskReport';
import RoomReport from '@components/report/roomReport';
import Dashboard from '@components/report/dashboard';

const { TabPane } = Tabs;

const Report = () => {
  const router = useRouter();
  const [choosedTab, setChoosedTab] = useState('2');

  const onChange = (key: string) => {
    setChoosedTab(key);
  };

  const options = {
    title: 'Тасаг тус бүрийн мэс заслын үзүүлэлт',
    width: 600,
    height: 400,
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
  };

  const items: TabsProps['items'] = [
    {
      key: '6',
      label: `Ерөнхий`,
      children: <Dashboard />,
    },
    {
      key: '1',
      label: `Тасаг`,
      children: <DepReport />,
    },
    {
      key: '2',
      label: `Ажилтан`,
      children: <UserReport />,
    },
    {
      key: '3',
      label: `Онош`,
      children: <DiagnoseReport />,
    },
    {
      key: '4',
      label: `Бүртгэл`,
      children: <TaskReport />,
    },
    {
      key: '5',
      label: `Өрөө`,
      children: <RoomReport />,
    },
  ];

  return (
    <MoreLayout>
      <div className={`border rounded px-8 bg-input py-4 mb-3 flex justify-between items-center`}>
        <div className="text-2xl font-bold">Тайлан</div>
      </div>
      <div className="p-2">
        <Tabs defaultActiveKey={choosedTab} items={items} onChange={onChange} />
      </div>
    </MoreLayout>
  );
};

export default withAuth(Report);
