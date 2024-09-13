import React, { useState, useEffect } from 'react';
import { DatePicker, Button } from 'antd';
import moment from 'moment';
import { Chart } from 'react-google-charts';
import { useRouter } from 'next/router';

// components
import Select from '@components/common/select';

// service
import reportService from '@services/report';

// utils
import timeFormatter from '@utils/TimeFormatter';

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
  response?: any;
  success?: boolean;
  message?: string;
}

const dateFormat = 'YYYY-MM-DD';
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

const roleItems = [
  { id: 1, name: 'Мэс заслын эмч' },
  { id: 4, name: 'Мэдээгүйжүүлгийн эмч' },
  { id: 5, name: 'Сувилагч' },
];

const UserReport = props => {
  interface Response {
    data: any;
  }

  const router = useRouter();
  const [users, setUsers] = useState(null);
  const [isReload, setReload] = useState(false);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);
  const [duty, setDuty] = useState(1);
  const [userDatas, setUserDatas] = useState([]);
  const [loadings, setLoadings] = useState(false);

  useEffect(() => {
    getUsers();
  }, [isReload, loadings]);

  const getUsers = async () => {
    const response: Response = await reportService.getUserList(
      `?startDate=${startDate}&endDate=${endDate}&duty=${duty}`
    );

    const userItems = [];
    await response.data.response.map(item => {
      userItems.push(item.id);
    });
    setUsers(userItems);

    const temp = [
      ['Ажилтан', 'Үзүүлэлт', 'Оператор', 'Дундаж', 'Нэгдүгээр', 'Дундаж', 'Хоёрдугаар', 'Дундаж'],
    ];
    const temp1 = [['Ажилтан', 'Үзүүлэлт', 'Дундаж']];
    if (duty === 1) {
      await response.data.response.map(item => {
        const average = timeFormatter(item.average);
        const average1 = timeFormatter(item.average1);
        const average2 = timeFormatter(item.average2);
        temp.push([
          item.firstName,
          item.sum,
          item.count,
          average,
          item.count1,
          average1,
          item.count2,
          average2,
        ]);
      });

      await setUserDatas(temp);
    } else {
      await response.data.response.map(item => {
        const average = `${Math.floor(item?.average / 60)}:${Math.floor(item?.average % 60)}`;
        temp1.push([item.firstName, item.count, average]);
      });

      await setUserDatas(temp1);
    }

    await setLoadings(false);
  };

  const onChangeStartDate = async (date, dateString) => {
    setStartDate(dateString);
  };

  const onChangeEndDate = async (date, dateString) => {
    setEndDate(dateString);
  };

  const handleRowClick = ({ chartWrapper, google }) => {
    const chart = chartWrapper.getChart();
    const selection = chart.getSelection();

    if (selection.length > 0) {
      const selectedItem = selection[0];

      if (selectedItem.row !== null) {
        // const newWindow = window.open(
        //   `/reports/users/${users[selectedItem.row]}`,
        //   '_blank',
        //   'noopener,noreferrer'
        // );
        // if (newWindow) newWindow.opener = null;
        router.push(`/reports/users/${users[selectedItem.row]}`);
        // console.log(users[selectedItem.row]);
        // console.log(`Row ${selectedItem.row + 1} clicked!`);
      }
    }
  };

  let maxUserCount = 0;
  if (users && users.length) {
    const sorted = users.sort((a, b) => b.sum - a.sum);
    maxUserCount = sorted[0].sum;
  }

  return (
    <div className="">
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
          <div className="flex items-start flex-col mr-4">
            <span className="mb-1">Үүргээр</span>
            <Select label="" value={duty} onChange={id => setDuty(id)} items={roleItems} />
          </div>
          <div className="flex items-start flex-col mr-4 mt-8">
            <Button type="primary" loading={loadings} onClick={() => setLoadings(true)}>
              Харах
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="mt-8 flex justify-start">
          {userDatas.length > 1 ? (
            <Chart
              chartType="Table"
              width="100%"
              height="100%"
              data={userDatas}
              options={options}
              formatters={formatters}
              chartEvents={[
                {
                  eventName: 'select',
                  callback: handleRowClick,
                },
              ]}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReport;
