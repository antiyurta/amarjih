import React, { useState, useEffect } from 'react';
import { DatePicker, Button, Select } from 'antd';
import moment from 'moment';

import { Chart } from 'react-google-charts';

import reportService from '@services/report';

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

export const optionsTask = {
  title: 'Тохиолдол ихтэй 10 мэс засал',
};

export const optionsAge = {
  title: 'Сонгосон мэс засал насны ангилалаар',
};

export const options = {
  allowHtml: true,
  showRowNumber: true,
};

export const formatters = [
  {
    type: 'BarFormat' as const,
    column: 1,
    options: {
      width: 740,
    },
  },
];

const TaskReport = props => {
  interface Response {
    data: any;
  }

  const [diagnoses, setDiagnoses] = useState([]);
  const [choosedDiagnoseId, setChoosedDiagnoseId] = useState(0);
  // const [diagnoseCounts, setDiagnoseCounts] = useState([]);
  const [diagnoseCountsAge, setDiagnoseCountsAge] = useState([]);
  const [isReload, setReload] = useState(false);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split('T')[0]);
  // const [loading, setLoading] = useState(false);
  const [cancelCounts, setCancelCounts] = useState([]);
  const [taskDatas, setDatas] = useState([]);
  const [loadings, setLoadings] = useState(false);

  useEffect(() => {
    getSurgeryCounts(`?startDate=${startDate}&endDate=${endDate}`);
    getSurgeryCountsAge(
      `?startDate=${startDate}&endDate=${endDate}&surgeryId=${choosedDiagnoseId}`
    );
    getCancelSurgeries(`?startDate=${startDate}&endDate=${endDate}&surgeryId=${choosedDiagnoseId}`);
  }, [isReload, loadings, choosedDiagnoseId]);

  const getSurgeryCounts = async query => {
    const response: Response = await reportService.getTaskCount(query);
    const temp2 = [
      {
        label: 'Бүгд',
        value: 0,
      },
    ];
    const temp3 = [['Бүртгэл', 'Үзүүлэлт', 'Хувь', 'Дундаж']];
    await response.data.response.map((item, ind) => {
      temp3.push([
        item.name,
        item.count,
        `${item.precent.toFixed(1)} %`,
        timeFormatter(item.average),
      ]);
      temp2.push({
        label: item.name,
        value: item.id,
      });
    });
    await setDatas(temp3);
    await setDiagnoses(temp2);
    await setLoadings(false);
  };

  const getSurgeryCountsAge = async query => {
    const response: Response = await reportService.getSurgeryCountAges(query);
    const temp = [['Нас', 'Үзүүлэлт']];
    await response.data.response.map(item => {
      temp.push([item.minAge + '-' + (item.maxAge === 200 ? 'дээш' : item.maxAge), item.count]);
    });

    setDiagnoseCountsAge(temp);
  };

  const getCancelSurgeries = async query => {
    const response: Response = await reportService.getCancelTaskCount(query);
    const temp = [['Шалтгаан', 'Үзүүлэлт']];
    await response.data.response.map(item => {
      temp.push([item.name, item.count]);
    });

    setCancelCounts(temp);
  };

  const onChangeStartDate = async (date, dateString) => {
    setStartDate(dateString);
  };

  const onChangeEndDate = async (date, dateString) => {
    setEndDate(dateString);
  };

  const handleChangeDiagnose = async id => {
    setChoosedDiagnoseId(id);
  };

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
          <div className="flex items-start flex-col mr-4 mt-8">
            <Button type="primary" loading={loadings} onClick={() => setLoadings(true)}>
              Харах
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-10">
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
        <div className="mt-4 flex justify-start">
          {diagnoses.length > 1 ? (
            <div>
              <div className="font-bold text-xl text-left mb-3">Насны ангилалаар</div>
              <div className="mb-4 flex flex-row justify-center items-center">
                <div className="mr-3">Бүртгэл сонгох</div>
                <Select
                  defaultValue={choosedDiagnoseId}
                  style={{ width: 320 }}
                  onChange={handleChangeDiagnose}
                  options={diagnoses}
                />
              </div>
              <Chart
                chartType="Table"
                width="100%"
                data={diagnoseCountsAge}
                options={options}
                formatters={formatters}
              />
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="mt-8 flex justify-start">
          {cancelCounts.length > 1 ? (
            <div className="">
              <div className="font-bold text-xl text-left mb-3">Цуцалсан шалтгаанаар</div>
              <div>
                <Chart
                  chartType="Table"
                  width="100%"
                  data={cancelCounts}
                  options={options}
                  formatters={formatters}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskReport;
