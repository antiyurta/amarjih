import React, { useState, useEffect } from 'react';
import { DatePicker, Button } from 'antd';
import { Chart } from 'react-google-charts';
import moment from 'moment';

// components
import Select from '@components/common/select';

// service
import reportService from '@services/report';

interface Response {
  response?: any;
  success?: boolean;
  message?: string;
}

export const options = {
  allowHtml: true,
  showRowNumber: true,
};

export const formatters = [
  {
    type: 'BarFormat' as const,
    column: 1,
    options: {
      width: 780,
    },
  },
];

const dateFormat = 'YYYY-MM-DD';
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

const DepReport = props => {
  interface Response {
    data: any;
  }

  const [deps, setDeps] = useState([]);
  const [isReload, setReload] = useState(false);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);
  const [loadings, setLoadings] = useState(false);

  useEffect(() => {
    getDepList();
  }, [isReload, loadings]);

  const getDepList = async () => {
    const temp = [['Тасаг', 'Үзүүлэлт']];
    const response: Response = await reportService.getDepList(
      `?startDate=${startDate}&endDate=${endDate}`
    );
    await response.data.response.map(item => {
      temp.push([item.name, item.count]);
    });
    setDeps(temp);
    setLoadings(false);
  };

  const onChangeStartDate = async (date, dateString) => {
    setStartDate(dateString);
  };

  const onChangeEndDate = async (date, dateString) => {
    setEndDate(dateString);
  };

  let maxCount = 0;
  if (deps && deps.length) {
    const sorted = deps.sort((a, b) => b.count - a.count);
    maxCount = sorted[0].count;
  }

  return (
    <div className="w-full">
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
      <div className="flex justify-start">
        <div className="mt-8 flex justify-start">
          {deps.length > 1 ? (
            <Chart
              chartType="Table"
              width="100%"
              height="100%"
              data={deps}
              options={options}
              formatters={formatters}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default DepReport;
