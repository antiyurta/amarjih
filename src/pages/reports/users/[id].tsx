import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Chart } from 'react-google-charts';

import Image from 'next/image';
import { DatePicker, Button } from 'antd';
import moment from 'moment';
import withAuth from '@hooks/hoc';

// components
import MoreLayout from '@components/layout/more';

import reportService from '@services/report';
import userService from '@services/user';

import timeFormatter from '@utils/TimeFormatter';

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

const dateFormat = 'YYYY-MM-DD';
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

export const options = {
  allowHtml: true,
  showRowNumber: true,
};

export const formatters = [
  {
    type: 'BarFormat' as const,
    column: 1,
    options: {
      width: 640,
    },
  },
];

interface Response {
  data: any;
}

const Report = () => {
  const router = useRouter();
  const [user, setUserInfo] = useState(null);
  const [userRolesCount, setUseRolesCount] = useState(null);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);
  const [taskDatas, setDatas] = useState([]);
  const [loadings, setLoadings] = useState(true);

  useEffect(() => {
    getUserInfo(router.query.id);
    getRolesCount(router.query.id, `?startDate=${startDate}&endDate=${endDate}`);
    getSurgeryCounts(`?startDate=${startDate}&endDate=${endDate}&userId=${router.query.id}`);
  }, [loadings, router.query]);

  const getSurgeryCounts = async query => {
    const response: Response = await reportService.getTaskCount(query);
    const temp3 = [['Бүртгэл', 'Үзүүлэлт', 'Хувь', 'Дундаж']];
    await response.data.response.map((item, ind) => {
      temp3.push([
        item.name,
        item.count,
        `${item.precent.toFixed(1)} %`,
        timeFormatter(item.average),
      ]);
    });
    await setDatas(temp3);
    await setLoadings(false);
  };

  const getUserInfo = async id => {
    const user: any = await userService.getOne(id);
    setUserInfo(user.response);
  };

  const getRolesCount = async (id, query) => {
    const res: any = await reportService.getOneUserRolesCount(id, query);
    setUseRolesCount(res.response);
  };

  const onChangeStartDate = async (date, dateString) => {
    setStartDate(dateString);
  };

  const onChangeEndDate = async (date, dateString) => {
    setEndDate(dateString);
  };

  return (
    <MoreLayout>
      <div className={`p-4 flex justify-start items-start flex-col`}>
        <div>
          <Button onClick={() => router.back()}>Буцах</Button>
        </div>
        <div className="text-2xl font-bold mt-4">АЖИЛТНЫ ДЭЛГЭРЭНГҮЙ ТАЙЛАН</div>
      </div>
      <div className="p-4 flex flex-col items-start">
        {user && (
          <div className="py-3 flex flex-row">
            <div>
              <div className="bg-[#EDEDED] w-[170px] h-[217px] flex items-center justify-center flex-col rounded-md">
                <div className="h-24 w-24 rounded-full border border-gray flex justify-center items-center overflow-hidden">
                  <Image
                    src={`${process.env.BASE_API_URL}local-files/${user.avatarId}`}
                    alt="avatar"
                    width={122}
                    height={122}
                    objectFit="cover"
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <span className="font-bold">{`${user.lastName[0]}.${user.firstName}`}</span>
                  <span className="font-semibold text-gray">{user.appStructure.name}</span>
                </div>
              </div>
            </div>
            <div className="ml-5 mr-10 flex flex-col items-start">
              <div className="mt-2">
                <span className="font-semibold text-gray">Тасаг:</span>
                <span className="font-bold ml-2">{user.depStructure.name}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-gray">Утас:</span>
                <span className="font-bold ml-2">{user.phone}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-gray">Имэйл:</span>
                <span className="font-bold ml-2">{user.email}</span>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="mt-2">
                <span className="font-semibold text-gray">Нийт:</span>
                <span className="font-bold ml-2">{userRolesCount?.sum}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-gray">Оператор:</span>
                <span className="font-bold ml-2">{userRolesCount?.count}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-gray">1-р туслах:</span>
                <span className="font-bold ml-2">{userRolesCount?.count1}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-gray">2-р туслах:</span>
                <span className="font-bold ml-2">{userRolesCount?.count2}</span>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <div className="flex justify-start items-center">
            <div className="flex flex-row">
              <div className="flex items-start flex-col mr-4">
                <span className="mb-2">Эхлэх огноо</span>
                <DatePicker
                  defaultValue={moment(startDate, dateFormat)}
                  className="h-9"
                  onChange={onChangeStartDate}
                />
              </div>
              <div className="flex items-start flex-col mr-4">
                <span className="mb-2">Дуусах огноо</span>
                <DatePicker
                  defaultValue={moment(endDate, dateFormat)}
                  className="h-9"
                  onChange={onChangeEndDate}
                />
              </div>
              <div className="flex items-start flex-col mr-4 mt-8">
                <Button type="primary" loading={loadings} onClick={() => setLoadings(true)}>
                  Харах
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-10 w-full">
            {taskDatas.length > 1 ? (
              <div className="">
                <div className="font-bold text-xl text-left mb-3">Үндсэн тайлан</div>
                <Chart
                  chartType="Table"
                  width="100%"
                  height="100%"
                  data={taskDatas}
                  options={options}
                  formatters={formatters}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </MoreLayout>
  );
};

export default withAuth(Report);
